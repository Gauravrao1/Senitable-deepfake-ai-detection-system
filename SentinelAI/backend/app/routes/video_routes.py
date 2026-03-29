from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.video_detector import analyze_video
from app.config import settings

router = APIRouter()

ALLOWED_VIDEO_TYPES = {
    "video/mp4", "video/mpeg", "video/webm", "video/avi",
    "video/x-msvideo", "video/quicktime", "video/x-matroska",
}


@router.post("/analyze")
async def detect_video_deepfake(file: UploadFile = File(...)):
    """Analyze an uploaded video for deepfake/AI-generation indicators."""
    if file.content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: {', '.join(ALLOWED_VIDEO_TYPES)}",
        )

    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 50MB.")

    result = analyze_video(contents)

    if "error" in result:
        raise HTTPException(status_code=422, detail=result["error"])

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "file_size": len(contents),
        "analysis": result,
    }


@router.get("/info")
async def video_detector_info():
    """Get information about the video detection module."""
    return {
        "module": "Video Deepfake Detector",
        "techniques": [
            "Frame-level CNN Analysis",
            "Temporal Consistency Checking",
            "Byte Pattern Analysis",
            "Noise Uniformity Detection",
            "Flicker Artifact Detection",
        ],
        "supported_formats": list(ALLOWED_VIDEO_TYPES),
        "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
        "features": [
            "Frame-by-frame noise analysis",
            "Temporal consistency scoring",
            "Edge density variance detection",
            "Byte entropy profiling",
            "Flicker and artifact detection",
            "Color shift anomaly detection",
        ],
    }
