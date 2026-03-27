"""
Genius AI Brain
================
The core intelligence engine. This is what makes Genius smart.
Connects to an LLM (like GPT-4) to understand and answer any question.
"""

import json
from datetime import datetime

from openai import AsyncOpenAI

from genius_ai.config import settings


# The system prompt that defines Genius AI's personality
GENIUS_SYSTEM_PROMPT = """You are Genius AI, a highly intelligent personal voice assistant.
You are like Jarvis from Iron Man - smart, helpful, and a little witty.

Your personality:
- You're confident and knowledgeable
- You give clear, concise answers (you're a voice assistant, keep it conversational)
- You're proactive - suggest helpful follow-ups
- You call the user "boss" occasionally, like Jarvis
- You're direct - no fluff, just value

Your capabilities:
- Answer any question on any topic
- Help manage calendar and schedule (Google Calendar)
- Help stay organized with tasks and reminders
- Provide real-time information and advice
- Have natural conversations

Current date/time: {current_time}

When the user asks about their calendar or schedule, use the available tools.
Keep responses concise since they'll be spoken aloud."""


class GeniusBrain:
    """The AI brain that powers Genius."""

    def __init__(self):
        self.client = AsyncOpenAI(
            api_key=settings.llm_api_key,
            base_url=settings.llm_base_url,
        )
        self.model = settings.llm_model
        self.conversation_history: list[dict] = []

    def _get_system_prompt(self) -> str:
        return GENIUS_SYSTEM_PROMPT.format(
            current_time=datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")
        )

    def _get_tools(self) -> list[dict]:
        """Define the tools/functions Genius can use."""
        return [
            {
                "type": "function",
                "function": {
                    "name": "get_calendar_events",
                    "description": "Get upcoming events from the user's Google Calendar",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "days_ahead": {
                                "type": "integer",
                                "description": "Number of days ahead to look (default 7)",
                                "default": 7,
                            }
                        },
                    },
                },
            },
            {
                "type": "function",
                "function": {
                    "name": "create_calendar_event",
                    "description": "Create a new event on the user's Google Calendar",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "description": "Event title",
                            },
                            "start_time": {
                                "type": "string",
                                "description": "Start time in ISO format",
                            },
                            "end_time": {
                                "type": "string",
                                "description": "End time in ISO format",
                            },
                            "description": {
                                "type": "string",
                                "description": "Event description (optional)",
                            },
                        },
                        "required": ["title", "start_time", "end_time"],
                    },
                },
            },
        ]

    async def think(self, user_message: str, tool_executor=None) -> str:
        """
        Process a user message and generate a response.
        This is the main thinking loop - like Jarvis processing a command.
        """
        self.conversation_history.append({
            "role": "user",
            "content": user_message,
        })

        messages = [
            {"role": "system", "content": self._get_system_prompt()},
            *self.conversation_history,
        ]

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=self._get_tools() if tool_executor else None,
                temperature=0.7,
                max_tokens=500,
            )

            assistant_message = response.choices[0].message

            # Handle tool calls (e.g., calendar operations)
            if assistant_message.tool_calls and tool_executor:
                return await self._handle_tool_calls(
                    assistant_message, messages, tool_executor
                )

            reply = assistant_message.content or "I'm not sure how to respond to that."

            self.conversation_history.append({
                "role": "assistant",
                "content": reply,
            })

            return reply

        except Exception as e:
            error_msg = f"My systems hit a snag, boss. Error: {str(e)}"
            return error_msg

    async def _handle_tool_calls(self, assistant_message, messages, tool_executor) -> str:
        """Execute tool calls and get final response."""
        messages.append(assistant_message.model_dump())

        for tool_call in assistant_message.tool_calls:
            fn_name = tool_call.function.name
            fn_args = json.loads(tool_call.function.arguments)

            result = await tool_executor(fn_name, fn_args)

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result),
            })

        # Get final response after tool execution
        follow_up = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=500,
        )

        reply = follow_up.choices[0].message.content or "Done, boss."

        self.conversation_history.append({
            "role": "assistant",
            "content": reply,
        })

        return reply

    def clear_memory(self):
        """Reset conversation history."""
        self.conversation_history = []
