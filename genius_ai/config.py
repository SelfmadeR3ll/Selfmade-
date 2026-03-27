"""
Genius AI Configuration
========================
Central configuration for all Genius AI settings.
"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    app_name: str = "Genius AI"
    wake_word: str = "hey genius"
    debug: bool = False

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # AI Brain - supports OpenAI API or any compatible endpoint
    llm_api_key: str = ""
    llm_model: str = "gpt-4"
    llm_base_url: str = "https://api.openai.com/v1"

    # Voice
    voice_enabled: bool = True
    voice_language: str = "en"
    voice_rate: int = 175  # words per minute for TTS

    # Google Calendar
    google_credentials_file: str = "credentials.json"
    google_token_file: str = "token.json"
    google_calendar_scopes: list[str] = [
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.events",
    ]

    class Config:
        env_file = ".env"
        env_prefix = "GENIUS_"


settings = Settings()
