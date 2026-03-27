/**
 * GENIUS AI - Frontend Voice Assistant
 * ======================================
 * Handles:
 * - Wake word detection ("Hey Genius") via Web Speech API
 * - Speech-to-text (browser-native)
 * - Text-to-speech (server-generated audio)
 * - WebSocket real-time communication
 * - Cross-device responsive UI
 */

class GeniusAI {
    constructor() {
        // Elements
        this.orb = document.getElementById('genius-orb');
        this.messages = document.getElementById('messages');
        this.conversation = document.getElementById('conversation');
        this.micBtn = document.getElementById('mic-btn');
        this.textInput = document.getElementById('text-input');
        this.sendBtn = document.getElementById('send-btn');
        this.statusDot = document.getElementById('status-indicator');
        this.statusText = document.getElementById('status-text');
        this.listeningIndicator = document.getElementById('listening-indicator');
        this.welcomeMessage = document.querySelector('.welcome-message');

        // State
        this.isListening = false;
        this.isActivated = false;  // Wake word detected
        this.isProcessing = false;
        this.ws = null;
        this.recognition = null;
        this.currentAudio = null;

        // Initialize
        this.init();
    }

    init() {
        this.setupWebSocket();
        this.setupSpeechRecognition();
        this.setupEventListeners();
        this.setStatus('online', 'Ready');
    }

    // ===== WebSocket Connection =====
    setupWebSocket() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('[Genius] WebSocket connected');
            this.setStatus('online', 'Ready');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleWSMessage(data);
        };

        this.ws.onclose = () => {
            this.setStatus('offline', 'Disconnected');
            // Reconnect after 3 seconds
            setTimeout(() => this.setupWebSocket(), 3000);
        };

        this.ws.onerror = () => {
            this.setStatus('offline', 'Connection Error');
        };
    }

    handleWSMessage(data) {
        switch (data.type) {
            case 'activated':
                this.isActivated = true;
                this.setStatus('listening', 'Listening');
                this.setOrbState('listening');
                this.addMessage(data.message, 'system');
                break;

            case 'response':
                this.isProcessing = false;
                this.addMessage(data.text, 'genius');
                this.setStatus('online', 'Ready');

                if (data.audio) {
                    this.playAudio(data.audio);
                } else {
                    this.setOrbState('idle');
                }
                break;

            case 'deactivated':
                this.isActivated = false;
                this.setStatus('online', 'Standing By');
                this.setOrbState('idle');
                break;

            case 'reset':
                this.isActivated = false;
                this.addMessage(data.message, 'system');
                this.setOrbState('idle');
                break;
        }
    }

    // ===== Speech Recognition =====
    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('[Genius] Speech Recognition not supported');
            this.micBtn.title = 'Voice not supported in this browser';
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        let finalTranscript = '';

        this.recognition.onresult = (event) => {
            let interim = '';
            finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interim += transcript;
                }
            }

            // Check for wake word in both interim and final results
            const textToCheck = finalTranscript || interim;

            if (textToCheck && finalTranscript) {
                this.sendVoiceTranscript(finalTranscript.trim());
                finalTranscript = '';
            }
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                // Restart if we're supposed to be listening
                try {
                    this.recognition.start();
                } catch (e) {
                    // Already started
                }
            } else {
                this.listeningIndicator.classList.add('hidden');
                this.micBtn.classList.remove('active');
            }
        };

        this.recognition.onerror = (event) => {
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                console.error('[Genius] Speech error:', event.error);
            }
        };
    }

    sendVoiceTranscript(text) {
        if (!text) return;

        // Show what the user said
        this.addMessage(text, 'user');

        // Send via WebSocket
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                type: 'transcript',
                text: text,
            }));

            this.isProcessing = true;
            this.setStatus('thinking', 'Thinking');
            this.setOrbState('thinking');
        }
    }

    // ===== Event Listeners =====
    setupEventListeners() {
        // Mic button - toggle continuous listening
        this.micBtn.addEventListener('click', () => {
            this.toggleListening();
        });

        // Send button
        this.sendBtn.addEventListener('click', () => {
            this.sendTextInput();
        });

        // Enter key
        this.textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendTextInput();
            }
        });
    }

    toggleListening() {
        if (!this.recognition) {
            this.addMessage('Voice recognition is not supported in this browser. Try Chrome or Edge.', 'system');
            return;
        }

        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        this.isListening = true;
        this.micBtn.classList.add('active');
        this.listeningIndicator.classList.remove('hidden');
        this.setStatus('listening', 'Listening');
        this.setOrbState('listening');

        try {
            this.recognition.start();
        } catch (e) {
            // Already started
        }
    }

    stopListening() {
        this.isListening = false;
        this.micBtn.classList.remove('active');
        this.listeningIndicator.classList.add('hidden');
        this.setStatus('online', 'Ready');
        this.setOrbState('idle');

        if (this.recognition) {
            this.recognition.stop();
        }
    }

    sendTextInput() {
        const text = this.textInput.value.trim();
        if (!text) return;

        this.textInput.value = '';

        // Hide welcome message on first interaction
        if (this.welcomeMessage && this.welcomeMessage.style.display !== 'none') {
            this.welcomeMessage.style.display = 'none';
        }

        this.addMessage(text, 'user');

        // Send via REST API (bypass wake word for typed input)
        this.sendCommand(text);
    }

    async sendCommand(text) {
        this.isProcessing = true;
        this.setStatus('thinking', 'Thinking');
        this.setOrbState('thinking');

        try {
            const response = await fetch('/api/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: text,
                    bypass_wake_word: true,
                }),
            });

            const data = await response.json();

            if (data.text) {
                this.addMessage(data.text, 'genius');
            }

            if (data.audio_base64) {
                this.playAudio(data.audio_base64);
            } else {
                this.setOrbState('idle');
            }

        } catch (error) {
            this.addMessage('Connection error. Make sure the server is running.', 'system');
            this.setOrbState('idle');
        }

        this.isProcessing = false;
        this.setStatus('online', 'Ready');
    }

    // ===== Audio Playback =====
    playAudio(base64Audio) {
        if (this.currentAudio) {
            this.currentAudio.pause();
        }

        this.setOrbState('speaking');

        const audioData = Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0));
        const blob = new Blob([audioData], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);

        this.currentAudio = new Audio(url);
        this.currentAudio.play();

        this.currentAudio.onended = () => {
            this.setOrbState('idle');
            URL.revokeObjectURL(url);
        };
    }

    // ===== UI Updates =====
    addMessage(text, sender) {
        // Hide welcome on first message
        if (this.welcomeMessage) {
            this.welcomeMessage.style.display = 'none';
        }

        const msgEl = document.createElement('div');
        msgEl.className = `message ${sender}`;

        if (sender === 'genius') {
            msgEl.innerHTML = `<div class="sender">GENIUS</div><div>${this.formatText(text)}</div>`;
        } else if (sender === 'user') {
            msgEl.textContent = text;
        } else {
            msgEl.textContent = text;
        }

        this.messages.appendChild(msgEl);
        this.scrollToBottom();
    }

    formatText(text) {
        // Basic markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    }

    scrollToBottom() {
        this.conversation.scrollTop = this.conversation.scrollHeight;
    }

    setStatus(state, text) {
        this.statusDot.className = `status-dot ${state}`;
        this.statusText.textContent = text;
    }

    setOrbState(state) {
        this.orb.className = 'genius-orb';
        if (state !== 'idle') {
            this.orb.classList.add(state);
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.genius = new GeniusAI();
});
