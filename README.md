# 🎬 VidSnapAI - AI-Powered Short Video Generator

![VidSnapAI Banner](https://via.placeholder.com/1000x300?text=VidSnapAI+-+Text+to+Video+AI+SaaS)

**VidSnapAI** is a full-stack AI SaaS Minimum Viable Product (MVP) designed to automate the creation of short-form vertical video content (TikToks, Instagram Reels, YouTube Shorts). By simply inputting a topic, the application dynamically generates an engaging script, synthesizes a human-like voiceover, fetches contextual background visuals, and renders a composite MP4 video complete with on-screen typography.

---

## ✨ Features

*   **🧠 AI Script Generation:** Automatically creates engaging, 3-part scripts (Hook, Body, Call-to-Action) using the Google Gemini API.
*   **🎙️ AI Voice Synthesis:** Converts the generated script into high-quality, human-like audio using the ElevenLabs API (with a built-in `gTTS` fallback).
*   **🖼️ Dynamic Visuals:** Fetches contextual, AI-generated background imagery via Pollinations AI.
*   **🎥 Programmatic Video Rendering:** Merges audio, visuals, and dynamic text overlays into a final MP4 file using Python's `MoviePy` library.
*   **🔐 Secure User Authentication:** Full user registration and login system with encrypted passwords using `bcrypt`.
*   **📚 Video History Dashboard:** Automatically saves generated videos to a user-specific gallery retrieved from a SQLite database.
*   **🛡️ Robust Error Handling & Fallbacks:** Engineered to prevent server crashes with fallback dummy scripts and alternative Text-to-Speech engines during API limits or outages.

---

## 🛠️ Technology Stack

**Frontend**
*   **React.js (Vite):** Fast, modern UI development.
*   **Bootstrap 5:** Fully responsive dashboard and aesthetic components.
*   **Axios:** Handling asynchronous HTTP requests to the backend.

**Backend**
*   **Python (Flask):** Robust REST API framework.
*   **SQLAlchemy:** Object-Relational Mapping (ORM) for database interactions.
*   **MoviePy:** Programmatic video composition and rendering.

**APIs & External Services**
*   **Google Gemini API:** LLM for scriptwriting.
*   **ElevenLabs API:** Premium Text-to-Speech synthesis.
*   **Pollinations AI:** Dynamic image generation.

---

## 🏗️ Project Architecture & Folder Structure

```text
VidSnapAI/
│
├── backend/                  # Flask Server & Python Logic
│   ├── app.py                # Main backend application file
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables (API Keys)
│
├── frontend/                 # React UI Application
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   └── main.jsx          # Entry point
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
│
├── database/                 # Local Database Storage
│   └── vidsnap.db            # SQLite database file
│
└── outputs/                  # Temporarily stores generated media
    ├── voice.mp3             # Synthesized audio
    ├── background.jpg        # Downloaded AI image
    └── final_video.mp4       # Rendered composite video
