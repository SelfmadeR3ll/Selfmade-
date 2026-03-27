"""
Genius AI API Routes
=====================
REST API and WebSocket endpoints for the Genius AI assistant.
"""

import base64
import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

from genius_ai.core.assistant import GeniusAssistant
from genius_ai.voice.wake_word import WakeWordDetector
from genius_ai.voice.speech import SpeechProcessor

router = APIRouter()

# Global instances (per-server, will be per-session in production)
assistant = GeniusAssistant()
wake_detector = WakeWordDetector()
speech = SpeechProcessor()


class TextCommand(BaseModel):
    text: str
    bypass_wake_word: bool = False


class CommandResponse(BaseModel):
    text: str
    audio_base64: str | None = None
    wake_word_detected: bool = False


@router.post("/api/command", response_model=CommandResponse)
async def process_command(command: TextCommand):
    """Process a text command (typed or transcribed from voice)."""

    text = command.text

    if not command.bypass_wake_word:
        detected, remaining_text = wake_detector.detect(text)
        if not detected:
            return CommandResponse(
                text="",
                wake_word_detected=False,
            )
        text = remaining_text if remaining_text else text

    # Process through the AI brain
    response_text = await assistant.process_command(text)

    # Generate speech audio
    try:
        audio_bytes = speech.text_to_speech_bytes(response_text)
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
    except Exception:
        audio_b64 = None

    return CommandResponse(
        text=response_text,
        audio_base64=audio_b64,
        wake_word_detected=True,
    )


@router.post("/api/reset")
async def reset_conversation():
    """Reset the conversation history."""
    assistant.reset_conversation()
    return {"status": "ok", "message": "Conversation reset, boss."}


@router.get("/api/status")
async def get_status():
    """Get system status."""
    return {
        "status": "online",
        "name": "Genius AI",
        "version": "0.1.0",
        "calendar_connected": assistant.calendar.is_connected,
    }


@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    """
    WebSocket for real-time voice conversation.
    This enables the Jarvis-like experience where Genius responds instantly.
    """
    await ws.accept()

    # Per-connection assistant and wake word detector
    ws_assistant = GeniusAssistant()
    ws_wake = WakeWordDetector()
    ws_speech = SpeechProcessor()
    active_session = False  # Whether wake word has been detected

    try:
        while True:
            data = await ws.receive_text()
            message = json.loads(data)

            msg_type = message.get("type", "")

            if msg_type == "transcript":
                # Voice transcript from browser
                text = message.get("text", "")

                if not active_session:
                    detected, remaining = ws_wake.detect(text)
                    if detected:
                        active_session = True
                        await ws.send_json({
                            "type": "activated",
                            "message": "Yes, boss? I'm listening.",
                        })
                        if remaining:
                            text = remaining
                        else:
                            continue
                    else:
                        continue

                # Process the command
                response_text = await ws_assistant.process_command(text)

                # Generate audio
                try:
                    audio_bytes = ws_speech.text_to_speech_bytes(response_text)
                    audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
                except Exception:
                    audio_b64 = None

                await ws.send_json({
                    "type": "response",
                    "text": response_text,
                    "audio": audio_b64,
                })

            elif msg_type == "deactivate":
                active_session = False
                ws_wake.reset()
                await ws.send_json({
                    "type": "deactivated",
                    "message": "Standing by, boss.",
                })

            elif msg_type == "reset":
                ws_assistant.reset_conversation()
                active_session = False
                await ws.send_json({
                    "type": "reset",
                    "message": "Memory cleared. Fresh start.",
                })

    except WebSocketDisconnect:
        pass
