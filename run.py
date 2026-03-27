#!/usr/bin/env python3
"""
Genius AI - Launch Script
==========================
Run this to start your personal AI assistant.

Usage:
    python run.py

Then open http://localhost:8000 on any device (phone, tablet, desktop).
Say "Hey Genius" or type a command to get started!
"""

import uvicorn
from genius_ai.config import settings


def main():
    uvicorn.run(
        "genius_ai.api.app:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )


if __name__ == "__main__":
    main()
