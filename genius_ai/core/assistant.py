"""
Genius AI Assistant
====================
The main orchestrator that connects the brain, voice, and integrations.
This is the "Genius" that the user interacts with.
"""

import json

from genius_ai.core.brain import GeniusBrain
from genius_ai.integrations.calendar import CalendarManager


class GeniusAssistant:
    """
    The main Genius AI assistant.
    Coordinates between the brain (LLM), voice system, and integrations.
    """

    def __init__(self):
        self.brain = GeniusBrain()
        self.calendar = CalendarManager()
        self.is_listening = False
        self.is_active = False

    async def process_command(self, text: str) -> str:
        """
        Process a voice or text command.
        This is the main entry point for all user interactions.
        """
        response = await self.brain.think(
            user_message=text,
            tool_executor=self._execute_tool,
        )
        return response

    async def _execute_tool(self, tool_name: str, args: dict) -> dict:
        """Execute a tool call from the brain."""
        tool_handlers = {
            "get_calendar_events": self._handle_get_events,
            "create_calendar_event": self._handle_create_event,
        }

        handler = tool_handlers.get(tool_name)
        if handler:
            return await handler(args)

        return {"error": f"Unknown tool: {tool_name}"}

    async def _handle_get_events(self, args: dict) -> dict:
        """Get calendar events."""
        days = args.get("days_ahead", 7)
        events = self.calendar.get_upcoming_events(days_ahead=days)
        return {"events": events}

    async def _handle_create_event(self, args: dict) -> dict:
        """Create a calendar event."""
        result = self.calendar.create_event(
            title=args["title"],
            start_time=args["start_time"],
            end_time=args["end_time"],
            description=args.get("description", ""),
        )
        return result

    def reset_conversation(self):
        """Start fresh conversation."""
        self.brain.clear_memory()
