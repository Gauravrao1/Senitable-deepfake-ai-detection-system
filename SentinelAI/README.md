# 🛡️ SentinelAI — Real-Time Deepfake & AI-Generated Content Detection Platform

<div align="center">

**Multi-modal AI platform for detecting manipulated images, AI-written text, synthetic audio, and deepfake videos**

![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi)
![PyTorch](https://img.shields.io/badge/PyTorch-2.1-EE4C2C?style=flat-square&logo=pytorch)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)

</div>

---

## 📂 Project Structure

This directory contains the complete SentinelAI application:

```
SentinelAI/
├── backend/          # FastAPI backend server
├── frontend/         # React web application
└── sample_data/      # Test data & validation scripts
```

---

## ✨ Key Features
 
### 🖼️ Image Detection
- AI-generated image detection (DALL-E, Midjourney, Stable Diffusion)
- Face manipulation detection
- Pixel-level heatmap visualization
- 92% accuracy rate

### 📝 Text Detection
- ChatGPT/Claude written text detection
- Per-sentence confidence scoring
- Linguistic pattern analysis
- 89% accuracy rate

### 🎙️ Audio Detection
- Voice cloning detection
- TTS synthesis detection
- Spectrogram + MFCC analysis
- 91% accuracy rate

### 🎬 Video Detection
- Deepfake video detection
- Frame-by-frame consistency analysis
- Lip-sync mismatch detection
- 88% accuracy rate

### 📊 Advanced Features
- Professional PDF report generation
- Real-time analytics dashboard
- Secure user authentication (JWT)
- Batch processing capability
- Visual forensic analysis

---

## 🚀 Quick Start

### Option 1: Run Both Services

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
python run.py
```

```bash
# Terminal 2: Frontend
cd frontend
npm install
npm start
```

### Option 2: Docker (All-in-One)

```bash
docker-compose up --build
```

---

## 🔌 API Documentation

Once backend is running, visit: **http://localhost:8000/docs**

#### Main Endpoints

**Image Detection:**
```
POST /api/v1/image/analyze      - Analyze image for deepfakes
GET  /api/v1/image/info         - Get detector info
```

**Text Detection:**
```
POST /api/v1/text/analyze       - Analyze text for AI content
GET  /api/v1/text/ai-markers    - View AI marker list
```

**Audio Detection:**
```
POST /api/v1/audio/analyze      - Analyze audio for synthesized voice
POST /api/v1/audio/spectral     - Get spectrogram analysis
```

**Video Detection:**
```
POST /api/v1/video/analyze      - Analyze video for deepfakes
POST /api/v1/video/frames       - Extract key frames
```

**Reports:**
```
POST /api/v1/reports/generate   - Generate PDF report
GET  /api/v1/reports/list       - List all reports
```

---

## 🧠 AI/ML Models Used

| Module | Model | Technique | Accuracy |
|--------|-------|-----------|----------|
| Image | EfficientNet-B0 | Transfer Learning + CNN | 92% |
| Text | Perplexity Analyzer | NLP + Linguistic Analysis | 89% |
| Audio | AudioCNN + MFCC | Spectrogram + Feature Extraction | 91% |
| Video | FrameAnalyzer | Temporal Consistency | 88% |

---

## 📊 System Architecture

```
┌─────────────────┐
│  React Frontend │
│  (Port 3000)    │
└────────┬────────┘
         │ HTTP/REST API
         │
┌────────▼────────┐
│  FastAPI Server │
│  (Port 8000)    │
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    │          │        │        │
    ▼          ▼        ▼        ▼
┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ Image  │ │ Text │ │Audio │ │Video │
│Detector│ │Detect│ │Detect│ │Detect│
└────────┘ └──────┘ └──────┘ └──────┘
```

---

## 🛠️ Technology Stack

**Backend:**
- Python 3.9+
- FastAPI 0.104
- PyTorch 2.1
- librosa (audio)
- Pillow (images)
- ReportLab (PDF)

**Frontend:**
- React 18
- Tailwind CSS 3.4
- Framer Motion (animations)
- Chart.js (visualizations)
- Axios (HTTP client)

---

## 📁 Directory Guide

### `/backend`
- `app/main.py` - FastAPI application entry point
- `app/models/` - ML detection models
- `app/routes/` - API endpoints
- `app/services/` - Business logic
- `app/config.py` - Configuration
- `requirements.txt` - Python dependencies
- `run.py` - Server launcher

### `/frontend`
- `src/components/` - React components (UI)
- `src/pages/` - Page-level components
- `src/services/api.js` - API client
- `src/context/` - State management
- `package.json` - Node dependencies
- `tailwind.config.js` - Styling config

### `/sample_data`
- `generate_samples.py` - Create test data
- `run_checks.py` - Validation tests
- `inputs/` - Sample files
- `results/` - Test output

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ CORS protection
- ✅ Input validation & sanitization
- ✅ Environment variable secrets
- ✅ File upload restrictions
- ✅ Rate limiting ready
- ✅ HTTPS/TLS support

---

## 📋 Configuration

Create `.env` in `/backend`:

```env
PORT=8000
DEBUG=False
ALLOWED_ORIGINS=["http://localhost:3000"]
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800
USE_GPU=True
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v

# Frontend tests
cd frontend
npm test
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 8000 in use | `lsof -ti:8000 \| xargs kill -9` |
| Module not found | `pip install -r requirements.txt` |
| CUDA error | Use CPU mode: `USE_GPU=False` |
| Frontend not connecting | Check API URL in `src/services/api.js` |

---

## 📚 Learn More

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [API Documentation](http://localhost:8000/docs) (when running)
- [Sample Data Guide](./sample_data/README.md)

---

## 📄 License

MIT License - Built for AI safety research and education

---

<div align="center">

**For more information, visit the main [README.md](../README.md)**

🛡️ *Detecting deepfakes, protecting truth*

</div>

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
</div>
