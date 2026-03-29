from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional
from app.services.report_service import generate_report
import io

router = APIRouter()


class ReportRequest(BaseModel):
    analysis_type: str = Field(..., pattern="^(image|text|audio|video)$")
    analysis_data: dict = Field(..., description="Analysis results to include in report")
    filename: Optional[str] = Field(None, description="Original filename analyzed")
    notes: Optional[str] = Field(None, max_length=2000, description="Additional notes")


@router.post("/generate")
async def create_report(request: ReportRequest):
    """Generate a forensic-style PDF analysis report."""
    try:
        pdf_buffer = generate_report(
            analysis_type=request.analysis_type,
            analysis_data=request.analysis_data,
            filename=request.filename,
            notes=request.notes,
        )

        return StreamingResponse(
            io.BytesIO(pdf_buffer),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=SentinelAI_Report_{request.analysis_type}.pdf"
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")


@router.get("/info")
async def report_info():
    """Get information about the report generation module."""
    return {
        "module": "Forensic Report Generator",
        "output_format": "PDF",
        "sections": [
            "Executive Summary",
            "Detection Results",
            "Detailed Analysis Metrics",
            "Risk Assessment",
            "Recommendations",
        ],
    }
