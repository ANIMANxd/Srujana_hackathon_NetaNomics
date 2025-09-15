import google.generativeai as genai
import os
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict
from app.database import get_db
from app.models import models
import json

router = APIRouter(
    prefix="/api/v1/budget",
    tags=["AI Budgeting"]
)

class BudgetRequest(BaseModel):
    constituency_name: str
    constituency_profile: str 
    total_budget: float = 50000000 

class BudgetItem(BaseModel):
    category: str
    amount: float
    justification: str
    example_project: str

class BudgetResponse(BaseModel):
    optimal_allocation: List[BudgetItem]

@router.post("/generate-optimal", response_model=BudgetResponse)
def generate_optimal_budget(request: BudgetRequest):
    """
    Uses an AI agent acting as a District Commissioner to generate an optimal
    budget allocation for a constituency based on its profile.
    """
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")

        prompt = f"""
        Act as an expert, ethical, and data-driven District Commissioner in India, specializing in the MPLADS program.

        Your task is to create an optimal budget allocation for a constituency with the following profile:
        **Constituency Profile:** {request.constituency_profile}
        **Total Budget:** {request.total_budget:,.0f} INR

        Based on this profile, allocate the entire budget across the following categories: "Road Construction", "Education", "Health & Sanitation", "Community Infrastructure", "Drinking Water", "Other".

        Your response MUST be a single, valid JSON object with one key "optimal_allocation".
        The value should be a list of objects. Each object MUST have:
        1. "category" (string): The category name.
        2. "amount" (float): The amount allocated in INR.
        3. "justification" (string): A brief, one-sentence explanation of why this allocation is important for this specific constituency profile.
        4. "example_project" (string): A single, concrete example of a project that could be funded under this category.

        Ensure the sum of all "amount" fields equals the total budget.
        """
        
        response = model.generate_content(prompt)
        print("---------- GEMINI RESPONSE FOR BUDGET ----------")
        print(response.text)
        print("----------------------------------------------")
        
        parsed_response = json.loads(response.text.strip().replace("```json", "").replace("```", ""))
        return BudgetResponse(optimal_allocation=parsed_response.get("optimal_allocation", []))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Budget Generation Failed: {str(e)}")