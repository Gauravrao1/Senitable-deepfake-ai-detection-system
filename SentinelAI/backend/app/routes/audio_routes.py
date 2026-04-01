from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.audio_detector import analyze_audio
from app.config import settings

router = APIRouter()

ALLOWED_AUDIO_TYPES = {
    "audio/wav", "audio/x-wav", "audio/mpeg", "audio/mp3",
    "audio/ogg", "audio/flac", "audio/x-flac", "audio/webm",
}


def _enforce_strict_v3_media(result: dict) -> dict:
    """Normalize media verdicts to strict_v3 thresholds at API boundary."""
    p = result.get("is_fake_probability")
    if p is None:
        return result

    if p >= 0.85:
        result["verdict"] = "LIKELY SYNTHETIC/CLONED VOICE"
        result["risk_level"] = "HIGH"
    elif p >= 0.72:
        result["verdict"] = "SUSPICIOUS — POSSIBLE VOICE MANIPULATION"
        result["risk_level"] = "MEDIUM"
    elif p <= 0.18:
        result["verdict"] = "LIKELY AUTHENTIC VOICE"
        result["risk_level"] = "LOW"
    else:
        result["verdict"] = "INCONCLUSIVE - NEEDS CLEANER OR LONGER AUDIO"
        result["risk_level"] = "MEDIUM"

    result["decision_policy"] = "strict_v3"
    result["confidence"] = round(float(p) * 100, 2)
    result["is_real_probability"] = round(1 - float(p), 4)
    return result


@router.post("/analyze")
async def detect_audio_deepfake(file: UploadFile = File(...)):
    """Analyze uploaded audio for voice cloning/synthesis indicators."""
    if file.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: {', '.join(ALLOWED_AUDIO_TYPES)}",
        )

    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 50MB.")

    result = analyze_audio(contents)

    if "error" in result:
        raise HTTPException(status_code=422, detail=result["error"])

    result = _enforce_strict_v3_media(result)

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "file_size": len(contents),
        "analysis": result,
    }


@router.get("/info")
async def audio_detector_info():
    """Get information about the audio detection module."""
    return {
        "module": "Audio Deepfake Detector",
        "techniques": ["Spectrogram Analysis", "MFCC Feature Extraction", "Pitch Analysis", "Energy Dynamics"],
        "supported_formats": list(ALLOWED_AUDIO_TYPES),
        "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
        "features": [
            "Mel spectrogram analysis",
            "MFCC coefficient analysis",
            "Pitch consistency detection",
            "Spectral smoothness analysis",
            "Energy dynamics evaluation",
            "Voice cloning indicator detection",
        ],
    }
