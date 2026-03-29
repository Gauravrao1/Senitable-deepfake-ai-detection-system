from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.models.text_detector import analyze_text

router = APIRouter()


class TextInput(BaseModel):
    text: str = Field(..., min_length=20, max_length=50000, description="Text to analyze")


@router.post("/analyze")
async def detect_ai_text(input_data: TextInput):
    """Analyze text for AI-generation indicators."""
    result = analyze_text(input_data.text)

    if "error" in result:
        raise HTTPException(status_code=422, detail=result["error"])

    return {
        "input_length": len(input_data.text),
        "analysis": result,
    }


@router.get("/info")
async def text_detector_info():
    """Get information about the text detection module."""
    return {
        "module": "AI Text Detector",
        "techniques": ["NLP Analysis", "Perplexity Scoring", "Burstiness Analysis", "Linguistic Pattern Recognition"],
        "max_text_length": 50000,
        "min_text_length": 20,
        "features": [
            "Perplexity-based analysis",
            "Burstiness scoring (sentence uniformity)",
            "AI marker word detection",
            "Contraction usage analysis",
            "Vocabulary richness measurement",
            "Per-sentence AI probability breakdown",
        ],
    }
