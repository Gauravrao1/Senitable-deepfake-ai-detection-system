"""
Forensic Report Generator
Generates professional PDF analysis reports using ReportLab.
"""

from datetime import datetime
import io
import logging

logger = logging.getLogger(__name__)


def generate_report(analysis_type: str, analysis_data: dict, filename: str = None, notes: str = None) -> bytes:
    """Generate a forensic-style PDF report."""
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.lib.colors import HexColor
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
        from reportlab.lib.enums import TA_CENTER, TA_LEFT

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=0.75*inch, bottomMargin=0.75*inch)

        styles = getSampleStyleSheet()

        # Custom styles
        title_style = ParagraphStyle(
            "CustomTitle", parent=styles["Title"],
            fontSize=26, textColor=HexColor("#1a1a2e"),
            spaceAfter=6, alignment=TA_CENTER,
        )
        subtitle_style = ParagraphStyle(
            "Subtitle", parent=styles["Normal"],
            fontSize=12, textColor=HexColor("#6366f1"),
            alignment=TA_CENTER, spaceAfter=20,
        )
        heading_style = ParagraphStyle(
            "SectionHeading", parent=styles["Heading2"],
            fontSize=16, textColor=HexColor("#1a1a2e"),
            spaceBefore=20, spaceAfter=10,
            borderWidth=1, borderColor=HexColor("#6366f1"),
            borderPadding=5,
        )
        body_style = ParagraphStyle(
            "CustomBody", parent=styles["Normal"],
            fontSize=11, leading=16, spaceAfter=8,
        )
        verdict_style = ParagraphStyle(
            "Verdict", parent=styles["Normal"],
            fontSize=14, textColor=HexColor("#dc2626"),
            alignment=TA_CENTER, spaceAfter=15,
            fontName="Helvetica-Bold",
        )

        elements = []

        # Header
        elements.append(Paragraph("SENTINELAI", title_style))
        elements.append(Paragraph("Deepfake & AI-Generated Content Detection Report", subtitle_style))
        elements.append(HRFlowable(width="100%", color=HexColor("#6366f1"), thickness=2))
        elements.append(Spacer(1, 15))

        # Report metadata
        type_labels = {"image": "Image Deepfake", "text": "AI Text", "audio": "Audio Deepfake", "video": "Video Deepfake"}
        meta_data = [
            ["Report ID:", f"SAI-{datetime.now().strftime('%Y%m%d%H%M%S')}"],
            ["Analysis Type:", type_labels.get(analysis_type, analysis_type).upper() + " DETECTION"],
            ["Date:", datetime.now().strftime("%B %d, %Y at %H:%M:%S")],
            ["File Analyzed:", filename or "N/A"],
        ]
        meta_table = Table(meta_data, colWidths=[2*inch, 4*inch])
        meta_table.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 10),
            ("TEXTCOLOR", (0, 0), (0, -1), HexColor("#374151")),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 20))

        # Executive Summary
        elements.append(Paragraph("1. EXECUTIVE SUMMARY", heading_style))

        verdict = analysis_data.get("verdict", "N/A")
        confidence = analysis_data.get("confidence", 0)
        risk_level = analysis_data.get("risk_level", "UNKNOWN")

        risk_colors = {"HIGH": "#dc2626", "MEDIUM": "#f59e0b", "LOW": "#10b981", "UNKNOWN": "#6b7280"}
        verdict_color = risk_colors.get(risk_level, "#6b7280")

        v_style = ParagraphStyle("DynVerdict", parent=verdict_style, textColor=HexColor(verdict_color))
        elements.append(Paragraph(f"VERDICT: {verdict}", v_style))

        summary_data = [
            ["Detection Confidence:", f"{confidence}%"],
            ["Risk Level:", risk_level],
            ["Fake Probability:", f"{analysis_data.get('is_fake_probability', analysis_data.get('is_ai_probability', 'N/A'))}"],
            ["Real Probability:", f"{analysis_data.get('is_real_probability', analysis_data.get('is_human_probability', 'N/A'))}"],
        ]
        summary_table = Table(summary_data, colWidths=[2.5*inch, 3.5*inch])
        summary_table.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 11),
            ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#e5e7eb")),
            ("BACKGROUND", (0, 0), (0, -1), HexColor("#f3f4f6")),
            ("PADDING", (0, 0), (-1, -1), 8),
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 20))

        # Detailed Analysis
        elements.append(Paragraph("2. DETAILED ANALYSIS", heading_style))

        details = analysis_data.get("analysis_details", {})
        if isinstance(details, dict):
            for key, value in details.items():
                clean_key = key.replace("_", " ").title()
                if isinstance(value, dict):
                    elements.append(Paragraph(f"<b>{clean_key}:</b>", body_style))
                    for sub_key, sub_value in value.items():
                        sub_clean = sub_key.replace("_", " ").title()
                        elements.append(Paragraph(f"&nbsp;&nbsp;&nbsp;{sub_clean}: {sub_value}", body_style))
                else:
                    elements.append(Paragraph(f"<b>{clean_key}:</b> {value}", body_style))
            elements.append(Spacer(1, 15))

        # Risk Assessment
        elements.append(Paragraph("3. RISK ASSESSMENT", heading_style))

        if risk_level == "HIGH":
            risk_text = ("This content shows <b>strong indicators</b> of being artificially generated or manipulated. "
                        "Exercise extreme caution before trusting or sharing this content. "
                        "Cross-reference with original sources where possible.")
        elif risk_level == "MEDIUM":
            risk_text = ("This content shows <b>some indicators</b> of possible AI generation or manipulation. "
                        "While not conclusive, additional verification is recommended. "
                        "Consider contextual factors before making judgments.")
        else:
            risk_text = ("This content shows <b>minimal indicators</b> of artificial generation. "
                        "While the analysis suggests authenticity, no detection method is 100% accurate. "
                        "Always consider the source and context of the content.")

        elements.append(Paragraph(risk_text, body_style))
        elements.append(Spacer(1, 15))

        # Recommendations
        elements.append(Paragraph("4. RECOMMENDATIONS", heading_style))
        recommendations = [
            "Verify the source and origin of the content independently.",
            "Cross-reference with known authentic versions when available.",
            "Consider the context in which the content was shared.",
            "Use multiple detection tools for comprehensive verification.",
            "Report suspected deepfakes to relevant platforms and authorities.",
        ]
        for i, rec in enumerate(recommendations, 1):
            elements.append(Paragraph(f"{i}. {rec}", body_style))

        # Notes
        if notes:
            elements.append(Spacer(1, 15))
            elements.append(Paragraph("5. ADDITIONAL NOTES", heading_style))
            elements.append(Paragraph(notes, body_style))

        # Footer
        elements.append(Spacer(1, 30))
        elements.append(HRFlowable(width="100%", color=HexColor("#6366f1"), thickness=1))
        footer_style = ParagraphStyle(
            "Footer", parent=styles["Normal"],
            fontSize=8, textColor=HexColor("#9ca3af"),
            alignment=TA_CENTER, spaceBefore=10,
        )
        elements.append(Paragraph(
            "Generated by SentinelAI - Deepfake & AI-Generated Content Detection Platform<br/>"
            "This report is for informational purposes only. Results should be verified independently.<br/>"
            f"Report generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}",
            footer_style,
        ))

        doc.build(elements)
        return buffer.getvalue()

    except ImportError:
        logger.warning("ReportLab not installed. Generating basic text report.")
        return _generate_text_report(analysis_type, analysis_data, filename, notes)


def _generate_text_report(analysis_type: str, analysis_data: dict, filename: str = None, notes: str = None) -> bytes:
    """Fallback text-based report when ReportLab is not available."""
    lines = [
        "=" * 60,
        "SENTINELAI - FORENSIC ANALYSIS REPORT",
        "=" * 60,
        f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"Analysis Type: {analysis_type.upper()} DETECTION",
        f"File: {filename or 'N/A'}",
        "-" * 60,
        "RESULTS",
        "-" * 60,
        f"Verdict: {analysis_data.get('verdict', 'N/A')}",
        f"Confidence: {analysis_data.get('confidence', 0)}%",
        f"Risk Level: {analysis_data.get('risk_level', 'UNKNOWN')}",
        "-" * 60,
    ]

    if notes:
        lines.extend(["NOTES:", notes, "-" * 60])

    lines.append("Generated by SentinelAI")

    return "\n".join(lines).encode("utf-8")
