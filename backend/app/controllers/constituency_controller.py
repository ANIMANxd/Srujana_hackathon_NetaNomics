from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List

from app.schemas import schemas
from app.models import models
from app.database import get_db

router = APIRouter(
    prefix="/api/v1",
    tags=["Constituencies"]
)

@router.get("/constituencies", response_model=List[schemas.ConstituencyScorecard])
def get_all_constituencies(db: Session = Depends(get_db)):
    """
    Returns a list of all constituencies with their current transparency status.
    """
    constituencies = db.query(models.Constituency).order_by(models.Constituency.state, models.Constituency.constituency_name).all()
    return constituencies


@router.get("/dashboard/{constituency_name}", response_model=schemas.DashboardResponse)
def get_dashboard_data(constituency_name: str, db: Session = Depends(get_db)):
    """
    Returns all the processed and analyzed data needed to build the dashboard
    for a single, specific constituency.
    """
    # 1. Fetch the core constituency data
    constituency = db.query(models.Constituency).filter(func.lower(models.Constituency.constituency_name) == constituency_name.lower()).first()

    if not constituency:
        raise HTTPException(status_code=404, detail="Constituency data not found")

    # 2. Calculate aggregate project data
    total_expenditure = db.query(func.sum(models.Project.allocated_amount)).filter(models.Project.constituency_id == constituency.id).scalar() or 0.0
    total_projects = db.query(func.count(models.Project.id)).filter(models.Project.constituency_id == constituency.id).scalar() or 0

    # 3. Calculate spending by category
    spending_by_category_query = db.query(
        models.Project.category,
        func.sum(models.Project.allocated_amount).label('amount')
    ).filter(models.Project.constituency_id == constituency.id).group_by(models.Project.category).all()
    
    spending_by_category = []
    for category, amount in spending_by_category_query:
        amount = amount or 0.0
        percentage = (amount / total_expenditure * 100) if total_expenditure > 0 else 0
        spending_by_category.append(
            schemas.SpendingByCategory(category=category, amount=amount, percentage=round(percentage, 1))
        )

    # 4. Calculate top 10 contractors
    top_10_contractors_query = db.query(
        models.Project.contractor_ngo_name.label("name"),
        func.sum(models.Project.allocated_amount).label("amount")
    ).filter(
        models.Project.constituency_id == constituency.id,
        models.Project.contractor_ngo_name.isnot(None) 
    ).group_by("name").order_by(desc("amount")).limit(10).all()


    top_10_contractors = [
        {"name": row.name, "amount": row.amount or 0.0} for row in top_10_contractors_query
    ]
 
    ai_insights = db.query(models.AIInsight).filter(models.AIInsight.constituency_id == constituency.id).all()

    # 6. Assemble the final response
    dashboard_data = schemas.DashboardResponse(
        mp_name=constituency.mp_name,
        constituency_name=constituency.constituency_name,
        id=constituency.id,
        last_report_date=constituency.last_report_date,
        state=constituency.state,
        total_expenditure=total_expenditure,
        total_projects=total_projects,
        spending_by_category=spending_by_category,
        top_10_contractors=top_10_contractors,
        ai_insights=ai_insights
    )
    
    return dashboard_data