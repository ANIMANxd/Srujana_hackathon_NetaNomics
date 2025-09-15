import google.generativeai as genai
import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(
    prefix="/api/v1/insights",
    tags=["AI Insights"]
)

class InsightDetailRequest(BaseModel):
    insight_id: int
    original_title: str
    original_finding: str

@router.post("/detail", response_model=schemas.InsightDetailResponse)
def get_insight_detail(request: InsightDetailRequest, db: Session = Depends(get_db)):
    """
    Performs a "deep dive" by retrieving pre-computed evidence
    linked to a specific AI insight and using an AI to summarize it.
    """
    try:
        evidence_pieces = db.query(models.Evidence).join(models.Project).filter(models.Evidence.insight_id == request.insight_id).all()
        
        if not evidence_pieces:
            return schemas.InsightDetailResponse(detailed_brief=f"**Finding:** {request.original_finding}\n\n*No specific projects were automatically linked as evidence for this finding by the AI auditor.*")

        brief = f"## Detailed Analysis: {request.original_title}\n\n"
        brief += f"**Finding:** {request.original_finding}\n\n"
        brief += "### Supporting Evidence from Report:\n"
        
        for evidence in evidence_pieces:
            project = evidence.project
            brief += f"- **Project:** *{project.project_description or 'N/A'}*\n"
            brief += f"  - **Amount:** {project.allocated_amount:,.0f} INR\n"
            brief += f"  - **Contractor:** {project.contractor_ngo_name or 'N/A'}\n"
            brief += f"  - **Auditor's Note:** {evidence.reasoning}\n\n"
        
        model = genai.GenerativeModel("gemini-2.0-flash")
        prompt = f"Based on the following evidence brief, generate 2 specific, data-driven questions a journalist could ask an MP:\n\n{brief}"
        response = model.generate_content(prompt)

        final_brief = brief + "\n### Suggested Questions for the MP\n" + response.text

        return schemas.InsightDetailResponse(detailed_brief=final_brief)
    except Exception as e:
        print(f"Insight detail generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))