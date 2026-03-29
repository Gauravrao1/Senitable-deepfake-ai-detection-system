from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.image_detector import analyze_image
from app.config import settings

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/gif"}


@router.post("/analyze")
async def detect_image_deepfake(file: UploadFile = File(...)):
    """Analyze an uploaded image for deepfake/AI-generation indicators."""
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed: {', '.join(ALLOWED_IMAGE_TYPES)}",
        )

    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 50MB.")

    result = analyze_image(contents)

    if "error" in result:
        raise HTTPException(status_code=422, detail=result["error"])

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "file_size": len(contents),
        "analysis": result,
    }


@router.get("/info")
async def image_detector_info():
    """Get information about the image detection module."""
    return {
        "module": "Image Deepfake Detector",
        "techniques": ["CNN + EfficientNet (Transfer Learning)", "Pixel Pattern Analysis", "Frequency Domain Analysis"],
        "supported_formats": list(ALLOWED_IMAGE_TYPES),
        "max_file_size_mb": settings.MAX_FILE_SIZE / (1024 * 1024),
        "features": [
            "Noise level analysis",
            "Edge consistency detection",
            "Color distribution analysis",
            "Frequency spectrum analysis",
            "Manipulation heatmap generation",
        ],
    }
