# SentinelAI

Real-time multi-modal detection platform for identifying AI-generated or manipulated content across image, text, audio, and video.

This repository contains:
- `SentinelAI/backend`: FastAPI API for media/text analysis and PDF report generation.
- `SentinelAI/frontend`: React web app for upload, analysis, visualization, and report download.
- `SentinelAI/sample_data`: sample assets and a script to run quick end-to-end checks.
 
## Highlights 

- 4 analysis modules: Image, Text, Audio, Video
- Forensic-style result explanations and strict decision policy (`strict_v3`)
- Heatmap output for image analysis
- Spectrogram output for audio analysis
- PDF report generation endpoint
- React dashboard with risk distribution and confidence charts
- Local session auth in frontend (demo workflow)

## What Is Implemented (Current)

SentinelAI currently uses signal-based and heuristic analysis pipelines (plus optional transformer support for text). It does **not** currently ship a fully trained deep learning model package in this repository by default.

### Image module
- Input validation for common image MIME types
- Pixel-level forensic signals:
  - Noise consistency
  - Edge consistency
  - Color distribution uniformity
  - Frequency-domain behavior
  - Symmetry patterns
- 32x32 manipulation heatmap output
- Strict thresholded verdict policy

### Text module
- Statistical and linguistic analysis:
  - Burstiness
  - Vocabulary richness
  - Marker phrase usage
  - Contraction rate
  - Repetition and entropy indicators
- Optional transformer-based detector (if `transformers` model is available)
- Per-sentence mini breakdown
- Strict thresholded verdict policy

### Audio module
- Full mode (with `librosa` + `soundfile`):
  - MFCC statistics
  - Mel spectrogram
  - Pitch consistency
  - Spectral smoothness
  - Zero-crossing and RMS dynamics
- Fallback mode when advanced libs are unavailable
- Strict thresholded verdict policy

### Video module
- OpenCV-enabled mode:
  - Frame extraction
  - Temporal consistency
  - Flicker and edge variance signals
- Byte-level statistical analysis always available:
  - Entropy profile
  - Repetition patterns
  - Frequency flatness
- Fallback behavior when OpenCV is unavailable
- Strict thresholded verdict policy

### Reporting module
- Generates forensic-style PDF reports via ReportLab
- Includes summary, detailed metrics, risk interpretation, recommendations
- Automatic text fallback if ReportLab is missing

### Frontend
- React + Tailwind + Framer Motion UI
- Protected routes for analysis pages
- LocalStorage-backed demo auth (register/login)
- Result cards with probability breakdown
- Dashboard charts (Chart.js)
- Downloadable reports from backend

## Repository Layout

```text
SentinelAI/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── sample_data/
    ├── inputs/
    ├── results/
    ├── generate_samples.py
    └── run_checks.py
```

## Tech Stack

### Backend
- FastAPI
- Uvicorn
- Pydantic
- NumPy, SciPy, Pillow
- librosa, soundfile (audio)
- OpenCV (optional for richer video analysis)
- ReportLab (PDF)

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- Axios
- Chart.js + react-chartjs-2
- react-hot-toast
- react-router-dom

## Quick Start

## 1) Backend setup

From workspace root:

```powershell
cd SentinelAI/backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

Backend endpoints:
- API root: `http://localhost:8000/`
- Health: `http://localhost:8000/health`
- Swagger docs: `http://localhost:8000/docs`

## 2) Frontend setup

Open a second terminal:

```powershell
cd SentinelAI/frontend
npm install
npm start
```

Frontend URL:
- `http://localhost:3000`

## 3) Optional sample checks

With backend running:

```powershell
cd SentinelAI/sample_data
python run_checks.py
```

Results are written to:
- `SentinelAI/sample_data/results/analysis_results.json`

## API Reference

Base URL: `http://localhost:8000/api/v1`

### Image
- `POST /image/analyze`
- `GET /image/info`

### Text
- `POST /text/analyze`
- `GET /text/info`

### Audio
- `POST /audio/analyze`
- `GET /audio/info`

### Video
- `POST /video/analyze`
- `GET /video/info`

### Reports
- `POST /reports/generate`
- `GET /reports/info`

## Example Requests

### Analyze text

```bash
curl -X POST http://localhost:8000/api/v1/text/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"This is a sample paragraph with enough words to trigger analysis logic in the detector."}'
```

### Analyze image

```bash
curl -X POST http://localhost:8000/api/v1/image/analyze \
  -F "file=@sample.jpg"
```

### Generate report

```bash
curl -X POST http://localhost:8000/api/v1/reports/generate \
  -H "Content-Type: application/json" \
  -o report.pdf \
  -d '{
    "analysis_type": "text",
    "analysis_data": {
      "verdict": "POSSIBLY AI-ASSISTED",
      "risk_level": "MEDIUM",
      "confidence": 74.2,
      "is_ai_probability": 0.742,
      "is_human_probability": 0.258
    }
  }'
```

## Configuration

Backend reads environment variables from `.env` if present. Current config fields:

- `MONGODB_URL` (default: `mongodb://localhost:27017`)
- `DATABASE_NAME` (default: `sentinel_ai`)
- `SECRET_KEY` (default: `change-this-in-production`)
- `ALLOWED_ORIGINS` (comma-separated, default: `http://localhost:3000`)

Frontend:
- `REACT_APP_API_URL` (default: `http://localhost:8000/api/v1`)

## Decision Policy (`strict_v3`)

All analysis routes normalize final decisions with consistent threshold bands:
- High confidence fake/AI range
- Medium suspicious/inconclusive bands
- Low confidence authentic range

This makes risk labeling consistent across modalities.

## Known Limitations

- Accuracy claims depend on data quality and deployment setup.
- Several detectors are heuristic/signal-based and may produce inconclusive results.
- Text module improves significantly when transformer models are installed.
- Video module quality improves with OpenCV and decodable frame extraction.
- Frontend auth is local demo auth (LocalStorage), not backend JWT auth.

## Troubleshooting

### Backend fails due to missing dependencies

```powershell
cd SentinelAI/backend
pip install -r requirements.txt
```

### Audio analysis returns limited result
- Ensure `librosa` and `soundfile` are installed correctly.
- Use WAV/MP3 files longer than 2 seconds.

### Video analysis seems generic
- Install OpenCV for frame-level analysis.
- Use higher-quality videos with sufficient duration.

### Frontend cannot reach backend
- Confirm backend is running on port 8000.
- Set `REACT_APP_API_URL` if API is hosted elsewhere.

## Security Notes

- Do not use default `SECRET_KEY` in production.
- Restrict `ALLOWED_ORIGINS` in production.
- Add file scanning, request throttling, and auth hardening before public deployment.

## Suggested Production Upgrades

- Replace heuristic modules with trained, versioned model artifacts
- Add asynchronous task queue for heavy audio/video jobs
- Add persistent database storage for analysis/report metadata
- Add backend authentication and user management APIs
- Add test coverage for routes and detector logic

## License

MIT (see project license file if present).

## Maintainer Note

This README reflects the **current code behavior** in this repository and avoids overstating capabilities beyond what is implemented.
