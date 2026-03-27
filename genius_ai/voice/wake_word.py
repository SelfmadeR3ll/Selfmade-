"""
Wake Word Detection
====================
Listens for "Hey Genius" to activate the assistant.
Like saying "Hey Google" or "Alexa" - but cooler.

This module handles two modes:
1. Browser-based: Wake word detection runs in JavaScript (Web Speech API)
2. Server-based: Wake word detection runs in Python (for desktop/embedded)
"""


class WakeWordDetector:
    """
    Detects the wake word "Hey Genius" in text input.

    The browser handles continuous listening via Web Speech API.
    This class processes the transcribed text server-side to detect activation.
    """

    WAKE_PHRASES = [
        "hey genius",
        "a genius",       # common misrecognition
        "hey genius",
        "hay genius",     # common misrecognition
        "hey geniuss",
    ]

    def __init__(self):
        self.is_activated = False

    def detect(self, text: str) -> tuple[bool, str]:
        """
        Check if the text contains the wake word.

        Returns:
            (activated, remaining_text) - whether wake word was found,
            and the command text after the wake word.
        """
        text_lower = text.lower().strip()

        for phrase in self.WAKE_PHRASES:
            if text_lower.startswith(phrase):
                # Extract the command after the wake word
                remaining = text_lower[len(phrase):].strip()
                self.is_activated = True
                return True, remaining

        # Also check if the text contains the wake word anywhere
        for phrase in self.WAKE_PHRASES:
            if phrase in text_lower:
                idx = text_lower.index(phrase) + len(phrase)
                remaining = text_lower[idx:].strip()
                self.is_activated = True
                return True, remaining

        return False, text

    def reset(self):
        """Reset activation state."""
        self.is_activated = False
