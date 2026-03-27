# GENIUS AI

**Your Personal AI Voice Assistant** - Like Jarvis from Iron Man, but real.

Say **"Hey Genius"** and ask anything. It listens, thinks, and talks back.

---

## What It Does

- **Voice Activated** - Say "Hey Genius" to wake it up, just like "Hey Google" or "Alexa"
- **AI Brain** - Powered by GPT-4 (or any LLM) - ask it anything
- **Google Calendar** - Reads your schedule, creates events, keeps you organized
- **Works Everywhere** - Phone, tablet, laptop, desktop - any device with a browser
- **Talks Back** - Full text-to-speech responses, like talking to a real assistant

## Architecture

```
genius_ai/
├── core/
│   ├── brain.py          # AI brain - LLM integration (GPT-4)
│   └── assistant.py      # Main orchestrator
├── voice/
│   ├── wake_word.py      # "Hey Genius" detection
│   └── speech.py         # Text-to-speech engine
├── integrations/
│   └── calendar.py       # Google Calendar integration
├── api/
│   ├── app.py            # FastAPI web server
│   └── routes.py         # REST API + WebSocket endpoints
├── templates/
│   └── index.html        # Web UI
└── static/
    ├── css/genius.css     # Jarvis-inspired dark UI
    └── js/genius.js       # Frontend voice + WebSocket handler
```

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure

```bash
cp .env.example .env
# Edit .env with your API key
```

Set your OpenAI API key (or any compatible LLM endpoint):
```
GENIUS_LLM_API_KEY=your-key-here
```

### 3. Run

```bash
python run.py
```

### 4. Open

Go to **http://localhost:8000** on any device.

Say **"Hey Genius"** or type a command!

## Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project, enable the Google Calendar API
3. Create OAuth 2.0 credentials
4. Download `credentials.json` to the project root
5. First time you ask about calendar, it will open a browser to authorize

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Python + FastAPI |
| AI Brain | OpenAI GPT-4 (configurable) |
| Voice Input | Web Speech API (browser) |
| Voice Output | gTTS (Google Text-to-Speech) |
| Real-time | WebSockets |
| Calendar | Google Calendar API |
| Frontend | Vanilla JS + CSS (no framework bloat) |

## Roadmap

- [ ] Smart home integration (lights, thermostat)
- [ ] Music playback control
- [ ] Weather and news briefings
- [ ] Multi-user support
- [ ] Custom wake word training
- [ ] Mobile app (React Native)
- [ ] Offline mode with local LLM
- [ ] Reminder and task management
- [ ] Email integration

---

*Built by Selfmade. The future is voice.*
