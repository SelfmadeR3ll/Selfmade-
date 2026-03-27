"""
Genius AI FastAPI Application
===============================
The main web server that serves both the API and the web interface.
"""

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from genius_ai.api.routes import router
from genius_ai.config import settings

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"

# Create the FastAPI app
app = FastAPI(
    title="Genius AI",
    description="Your Personal AI Voice Assistant - Like Jarvis, but real.",
    version="0.1.0",
)

# CORS - allow connections from any device on the network
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files and templates
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

# Include API routes
app.include_router(router)


@app.get("/")
async def home(request: Request):
    """Serve the main Genius AI interface."""
    return templates.TemplateResponse("index.html", {
        "request": request,
        "app_name": settings.app_name,
    })


@app.on_event("startup")
async def startup():
    print(r"""
    ╔═══════════════════════════════════════════╗
    ║           🧠 GENIUS AI v0.1.0             ║
    ║       Your Personal Voice Assistant        ║
    ║                                           ║
    ║   Say "Hey Genius" to get started!        ║
    ║                                           ║
    ║   Web UI: http://localhost:8000           ║
    ╚═══════════════════════════════════════════╝
    """)
