from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.models.text_detector import analyze_text

router = APIRouter()


def _enforce_strict_v3_text(result: dict) -> dict:
    """Normalize text verdicts to strict_v3 thresholds at API boundary."""
    p = result.get("is_ai_probability")
    if p is None:
        return result

    if p >= 0.85:
        result["verdict"] = "LIKELY AI-GENERATED"
        result["risk_level"] = "HIGH"
    elif p >= 0.72:
        result["verdict"] = "POSSIBLY AI-ASSISTED"
        result["risk_level"] = "MEDIUM"
    elif p <= 0.18:
        result["verdict"] = "LIKELY HUMAN-WRITTEN"
        result["risk_level"] = "LOW"
    else:
        result["verdict"] = "INCONCLUSIVE - NEEDS LONGER OR HIGHER-QUALITY TEXT"
        result["risk_level"] = "MEDIUM"

    result["decision_policy"] = "strict_v3"
    result["confidence"] = round(float(p) * 100, 2)
    result["is_human_probability"] = round(1 - float(p), 4)
    return result


class TextInput(BaseModel):
    text: str = Field(..., min_length=20, max_length=50000, description="Text to analyze")


@router.post("/analyze")
async def detect_ai_text(input_data: TextInput):
    """Analyze text for AI-generation indicators."""
    result = analyze_text(input_data.text)

    if "error" in result:
        raise HTTPException(status_code=422, detail=result["error"])

    result = _enforce_strict_v3_text(result)

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
