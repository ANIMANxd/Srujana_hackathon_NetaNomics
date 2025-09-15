from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from app.models.models import TransparencyStatus, AISeverity

# --- Schemas for API Contract ---

# Endpoint 1: /api/v1/constituencies
class ConstituencyScorecard(BaseModel):
    id: int
    mp_name: str
    constituency_name: str
    state: str
    transparency_status: TransparencyStatus
    last_report_date: Optional[date]
    mp_email: Optional[str] 

    class Config:
        from_attributes = True

# Endpoint 2: /api/v1/dashboard/{constituency_name}
class SpendingByCategory(BaseModel):
    category: str
    amount: float
    percentage: float

class TopContractor(BaseModel):
    name: str
    amount: float
    
class AIInsightInfo(BaseModel):
    id: int
    title: str
    finding: str
    severity: AISeverity

    class Config:
        from_attributes = True

class DashboardResponse(BaseModel):
    id: int
    mp_name: str
    constituency_name: str
    last_report_date: Optional[date]
    total_expenditure: float
    total_projects: int
    spending_by_category: List[SpendingByCategory]
    top_10_contractors: List[TopContractor]
    ai_insights: List[AIInsightInfo]


class LegalRequest(BaseModel):
    constituency_name: str
    mp_name: str
    finding: str 

class LegalDocsResponse(BaseModel):
    rti_application: str
    first_appeal: str
    pil_brief: str

class InsightDetailRequest(BaseModel):
    constituency_id: int
    original_title: str
    original_finding: str

class InsightDetailResponse(BaseModel):
    detailed_brief: str