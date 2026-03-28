"""
Google Calendar Integration
=============================
Connects Genius AI to Google Calendar so it can:
- Read your upcoming events
- Create new events
- Help you stay organized

Setup: You need a Google Cloud project with Calendar API enabled
and OAuth 2.0 credentials (credentials.json).
"""

import os
from datetime import datetime, timedelta

from genius_ai.config import settings

# Google API imports are deferred to connect() time to avoid
# crashing the app if google libs have missing system dependencies.
GOOGLE_AVAILABLE = None  # will be set on first connect attempt


class CalendarManager:
    """Manages Google Calendar integration for Genius AI."""

    def __init__(self):
        self.service = None
        self.is_connected = False

    @staticmethod
    def _load_google_libs():
        """Try to import Google libraries at runtime."""
        global GOOGLE_AVAILABLE
        if GOOGLE_AVAILABLE is not None:
            return GOOGLE_AVAILABLE
        try:
            import google.auth.transport.requests  # noqa: F401
            import google.oauth2.credentials  # noqa: F401
            import google_auth_oauthlib.flow  # noqa: F401
            import googleapiclient.discovery  # noqa: F401
            GOOGLE_AVAILABLE = True
        except Exception:
            GOOGLE_AVAILABLE = False
        return GOOGLE_AVAILABLE

    def connect(self) -> bool:
        """
        Authenticate and connect to Google Calendar.
        Uses OAuth 2.0 flow - first time will open a browser for auth.
        """
        if not self._load_google_libs():
            return False

        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from googleapiclient.discovery import build

        creds = None

        # Load existing token
        if os.path.exists(settings.google_token_file):
            creds = Credentials.from_authorized_user_file(
                settings.google_token_file, settings.google_calendar_scopes
            )

        # Refresh or get new credentials
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(settings.google_credentials_file):
                    return False

                flow = InstalledAppFlow.from_client_secrets_file(
                    settings.google_credentials_file,
                    settings.google_calendar_scopes,
                )
                creds = flow.run_local_server(port=0)

            # Save token for next time
            with open(settings.google_token_file, "w") as token:
                token.write(creds.to_json())

        self.service = build("calendar", "v3", credentials=creds)
        self.is_connected = True
        return True

    def get_upcoming_events(self, days_ahead: int = 7, max_results: int = 20) -> list[dict]:
        """Get upcoming calendar events."""
        if not self.is_connected:
            if not self.connect():
                return [{"error": "Google Calendar not connected. Set up credentials.json first."}]

        now = datetime.utcnow()
        time_min = now.isoformat() + "Z"
        time_max = (now + timedelta(days=days_ahead)).isoformat() + "Z"

        try:
            events_result = (
                self.service.events()
                .list(
                    calendarId="primary",
                    timeMin=time_min,
                    timeMax=time_max,
                    maxResults=max_results,
                    singleEvents=True,
                    orderBy="startTime",
                )
                .execute()
            )

            events = events_result.get("items", [])
            return [
                {
                    "id": event.get("id"),
                    "title": event.get("summary", "No title"),
                    "start": event["start"].get("dateTime", event["start"].get("date")),
                    "end": event["end"].get("dateTime", event["end"].get("date")),
                    "location": event.get("location", ""),
                    "description": event.get("description", ""),
                }
                for event in events
            ]
        except Exception as e:
            return [{"error": f"Failed to fetch events: {str(e)}"}]

    def create_event(
        self, title: str, start_time: str, end_time: str, description: str = ""
    ) -> dict:
        """Create a new calendar event."""
        if not self.is_connected:
            if not self.connect():
                return {"error": "Google Calendar not connected."}

        event_body = {
            "summary": title,
            "description": description,
            "start": {
                "dateTime": start_time,
                "timeZone": "America/New_York",
            },
            "end": {
                "dateTime": end_time,
                "timeZone": "America/New_York",
            },
        }

        try:
            event = (
                self.service.events()
                .insert(calendarId="primary", body=event_body)
                .execute()
            )
            return {
                "success": True,
                "event_id": event.get("id"),
                "link": event.get("htmlLink"),
            }
        except Exception as e:
            return {"error": f"Failed to create event: {str(e)}"}
