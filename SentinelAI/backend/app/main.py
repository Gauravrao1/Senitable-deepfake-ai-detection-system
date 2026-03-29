from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import image_routes, text_routes, audio_routes, video_routes, report_routes
import os

app = FastAPI(
    title="SentinelAI",
    description="Real-Time Deepfake & AI-Generated Content Detection Platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app.include_router(image_routes.router, prefix="/api/v1/image", tags=["Image Detection"])
app.include_router(text_routes.router, prefix="/api/v1/text", tags=["Text Detection"])
app.include_router(audio_routes.router, prefix="/api/v1/audio", tags=["Audio Detection"])
app.include_router(video_routes.router, prefix="/api/v1/video", tags=["Video Detection"])
app.include_router(report_routes.router, prefix="/api/v1/reports", tags=["Reports"])


@app.get("/")
async def root():
    return {
        "name": "SentinelAI",
        "version": "1.0.0",
        "status": "operational",
        "endpoints": {
            "image_detection": "/api/v1/image/analyze",
            "text_detection": "/api/v1/text/analyze",
            "audio_detection": "/api/v1/audio/analyze",
            "video_detection": "/api/v1/video/analyze",
            "reports": "/api/v1/reports",
        },
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
