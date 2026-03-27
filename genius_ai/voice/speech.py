"""
Speech Processing
==================
Handles Speech-to-Text (STT) and Text-to-Speech (TTS).

Two modes:
- Browser mode: Uses Web Speech API (runs in browser JS, no server processing needed)
- Server mode: Uses Google Speech Recognition + gTTS for server-side processing
"""

import io
import tempfile

from gtts import gTTS

from genius_ai.config import settings


class SpeechProcessor:
    """Handles text-to-speech conversion on the server side."""

    def __init__(self):
        self.language = settings.voice_language

    def text_to_speech_bytes(self, text: str) -> bytes:
        """
        Convert text to speech audio bytes.
        Returns MP3 audio data that can be sent to the browser.
        """
        tts = gTTS(text=text, lang=self.language, slow=False)
        audio_buffer = io.BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        return audio_buffer.read()

    def text_to_speech_file(self, text: str) -> str:
        """
        Convert text to speech and save to a temp file.
        Returns the file path.
        """
        tts = gTTS(text=text, lang=self.language, slow=False)
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as f:
            tts.save(f.name)
            return f.name
