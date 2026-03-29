# 🛡️ SentinelAI — Real-Time Deepfake & AI-Generated Content Detection Platform

<div align="center">

**Multi-modal AI platform for detecting manipulated images, AI-written text, and synthetic audio**

![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-2.1-EE4C2C?style=flat-square&logo=pytorch)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)

</div>

---

## 🎯 What is SentinelAI?

SentinelAI is a **comprehensive deepfake and AI-generated content detection platform** that analyzes three types of media:

| Module | AI/ML Technique | What it Detects |
|--------|----------------|-----------------|
| 🖼️ **Image Detector** | CNN + EfficientNet (Transfer Learning) | AI-generated/manipulated images with pixel-level heatmaps |
| 📝 **Text Detector** | NLP + Perplexity/Burstiness Analysis | AI-written text (ChatGPT, Claude, etc.) with per-sentence breakdown |
| 🎙️ **Audio Detector** | Spectrogram + MFCC Analysis | Voice cloning, TTS synthesis, audio manipulation |
| 📊 **Dashboard** | Chart.js Data Visualization | Aggregated results, confidence charts, risk distribution |
| 📄 **Report Generator** | ReportLab PDF | Professional forensic-style analysis reports |

---

## 🏗️ Project Architecture

```
SentinelAI/
├── backend/                    # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py             # FastAPI application entry
│   │   ├── config.py           # Configuration management
│   │   ├── models/             # ML Detection Models
│   │   │   ├── image_detector.py   # EfficientNet + pixel analysis
│   │   │   ├── text_detector.py    # NLP + linguistic analysis
│   │   │   └── audio_detector.py   # MFCC + spectrogram analysis
│   │   ├── routes/             # API Endpoints
│   │   │   ├── image_routes.py
│   │   │   ├── text_routes.py
│   │   │   ├── audio_routes.py
│   │   │   └── report_routes.py
│   │   ├── services/           # Business Logic
│   │   │   └── report_service.py   # PDF report generation
│   │   └── utils/
│   │       └── helpers.py
│   ├── requirements.txt
│   └── run.py
│
├── frontend/                   # React + Tailwind Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Navigation with mobile support
│   │   │   ├── Hero.jsx            # Landing page hero section
│   │   │   ├── ImageDetector.jsx   # Image upload + analysis UI
│   │   │   ├── TextDetector.jsx    # Text input + analysis UI
│   │   │   ├── AudioDetector.jsx   # Audio upload + analysis UI
│   │   │   ├── ResultCard.jsx      # Universal result display
│   │   │   ├── HeatmapViewer.jsx   # Canvas-based heatmap renderer
│   │   │   ├── Dashboard.jsx       # Chart.js visualizations
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ImageAnalysis.jsx
│   │   │   ├── TextAnalysis.jsx
│   │   │   ├── AudioAnalysis.jsx
│   │   │   └── Reports.jsx
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css               # Tailwind + custom styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **npm or yarn**

### 1. Backend Setup

```bash
cd SentinelAI/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server
python run.py
```

The API will be available at **http://localhost:8000**

API Docs: **http://localhost:8000/docs** (Swagger UI)

### 2. Frontend Setup

```bash
cd SentinelAI/frontend

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/image/analyze` | Upload image for deepfake detection |
| `POST` | `/api/v1/text/analyze` | Submit text for AI detection |
| `POST` | `/api/v1/audio/analyze` | Upload audio for voice clone detection |
| `POST` | `/api/v1/reports/generate` | Generate PDF forensic report |
| `GET`  | `/api/v1/{module}/info` | Get module information |
| `GET`  | `/health` | Health check |

---

## 🧠 AI/ML Techniques Used

### Image Detection
- **EfficientNet-B0** with transfer learning for binary classification
- **Pixel-level noise analysis** — detects uniform noise patterns typical of AI-generated images
- **Edge consistency analysis** — Sobel filters to find unnatural edge patterns
- **Frequency domain analysis** — FFT to detect spectral anomalies
- **Color distribution analysis** — identifies unusual color patterns
- **Grad-CAM style heatmaps** — visualizes most suspicious regions

### Text Detection
- **Perplexity analysis** — measures predictability of text
- **Burstiness scoring** — AI text has uniform sentence lengths; humans vary
- **Vocabulary richness** — Type-Token Ratio analysis
- **AI marker detection** — identifies overused AI phrases ("furthermore", "delve", "crucial")
- **Contraction analysis** — AI tends to avoid contractions
- **Shannon entropy** — information theory-based analysis
- **Per-sentence breakdown** — individual AI probability for each sentence

### Audio Detection
- **MFCC (Mel-frequency cepstral coefficients)** — vocal tract modeling
- **Mel Spectrogram analysis** — frequency-time representation
- **Pitch consistency detection** — cloned voices have unnatural pitch stability
- **Spectral smoothness analysis** — synthetic audio has smoother spectra
- **Zero-crossing rate** — temporal audio feature
- **Energy dynamics** — natural speech has dynamic energy patterns

---

## 🎨 Frontend Features

- **Glass-morphism UI** with dark theme
- **Gradient animations** and smooth transitions (Framer Motion)
- **Drag & drop** file upload with preview
- **Real-time analysis** with loading states
- **Interactive heatmaps** rendered on HTML5 Canvas
- **Per-sentence highlighting** for text analysis  
- **Chart.js dashboards** with doughnut & bar charts
- **Mobile responsive** with hamburger navigation
- **Toast notifications** for user feedback
- **PDF report download** with one click

---

## 📊 Sample Analysis Output

```json
{
  "verdict": "LIKELY AI-GENERATED/MANIPULATED",
  "risk_level": "HIGH",
  "confidence": 87.34,
  "is_fake_probability": 0.8734,
  "is_real_probability": 0.1266,
  "analysis_details": {
    "noise_analysis": { "score": 0.0234, "interpretation": "Low noise uniformity..." },
    "edge_consistency": { "score": 1.876, "interpretation": "Edge patterns show..." },
    "color_distribution": { "score": 0.082, "interpretation": "Unusual color..." },
    "frequency_analysis": { "score": 2.45, "interpretation": "Frequency anomalies..." }
  },
  "heatmap": [[0.12, 0.34, ...], ...]
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Tailwind CSS 3.4, Framer Motion, Chart.js, React Router |
| **Backend** | Python, FastAPI, Uvicorn |
| **ML/AI** | PyTorch, TensorFlow, EfficientNet, HuggingFace Transformers |
| **Audio** | librosa, soundfile, MFCC analysis |
| **Reports** | ReportLab (PDF generation) |
| **HTTP** | Axios, REST API |

---

## 📄 License

This project is built for educational and research purposes in AI safety.

---

<div align="center">
<b>Built with ❤️ for a safer digital world</b>
</div>
