import datetime
import os
import json
import re
from sqlalchemy.orm import Session
import time
import pytesseract
from pdf2image import convert_from_path
import google.generativeai as genai
from app.models import models
import platform

# This is handled globally by main.py's lifespan event.

def extract_text_from_pdf(pdf_path: str) -> str:
    print(f"  [AI Stage 1] Starting LOCAL OCR for: {pdf_path}")
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"The specified PDF file was not found: {pdf_path}")
    if platform.system() == "Windows":
        tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        if os.path.exists(tesseract_path):
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        else:
            raise FileNotFoundError(f"Tesseract executable not found at {tesseract_path}.")
    try:
        images = convert_from_path(pdf_path)
        full_text = "".join([pytesseract.image_to_string(image) + "\n\n--- End of Page ---\n\n" for image in images])
        print(f"  [AI Stage 1] OCR Complete. Processed {len(images)} pages.")
        return full_text
    except Exception as e:
        raise e

def structure_data_with_gemini(pages: list) -> list:
    print(f"  [AI Stage 2] Structuring data with Gemini using BATCH PROCESSING...")
    model = genai.GenerativeModel("gemini-2.0-flash")
    all_extracted_projects = []
    batch_size = 4
    for i in range(0, len(pages), batch_size):
        batch_pages = pages[i:i + batch_size]
        batch_number = (i // batch_size) + 1
        print(f"\n    --- Analyzing Batch {batch_number} (Pages {i+1}-{min(i+batch_size, len(pages))}) ---")
        combined_text = "".join(batch_pages)
        if len(combined_text.strip()) < 100: continue
        prompt = f"""
        Analyze the provided text from MULTIPLE PAGES of an MPLADS report and extract all project details.
        For each project, extract: "project_description", "allocated_amount", "location", "contractor_ngo_name", and a "category" from ["Road Construction", "Education", "Health & Sanitation", "Community Infrastructure", "Drinking Water", "Other"].
        The final output for this batch MUST be a single JSON object with one key, "projects", containing a list of ALL project objects found.
        ---
        {combined_text}
        ---
        """
        try:
            response = model.generate_content(prompt)
            if not response.parts:
                print(f"        - WARNING: Gemini returned an empty response for this batch. Feedback: {response.prompt_feedback}")
                continue
            cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
            result = json.loads(cleaned_response)
            batch_projects = result.get("projects", [])
            if batch_projects:
                print(f"        - SUCCESS: Found {len(batch_projects)} projects in this batch.")
                all_extracted_projects.extend(batch_projects)
        except Exception as e:
            print(f"        - ERROR: Batch AI call failed. REASON: {e}")
        if (i + batch_size) < len(pages):
            print("        - Waiting 10 seconds before next batch...")
            time.sleep(10)
    print(f"\n  [AI Stage 2] Gemini structuring complete. Found a total of {len(all_extracted_projects)} projects.")
    return all_extracted_projects

def run_high_accuracy_audit_pipeline(db: Session, constituency_id: int):
    print("\n--- Starting High-Accuracy Audit Pipeline ---")
    projects = db.query(models.Project).filter(models.Project.constituency_id == constituency_id).all()
    if not projects:
        print("  -> No projects found for this constituency. Audit cannot run.")
        return
    print("  -> Clearing old insights and evidence...")
    db.query(models.AIInsight).filter(models.AIInsight.constituency_id == constituency_id).delete()
    db.commit()
    _run_concentration_agent(db, constituency_id, projects)
    _run_vagueness_agent(db, constituency_id, projects)
    print("--- High-Accuracy Audit Pipeline Complete ---\n")

def _run_concentration_agent(db: Session, constituency_id: int, projects: list):
    print("  [AUDIT AGENT 1/2] Running 'Concentration Risk Analyst'...")
    total_expenditure = sum(p.allocated_amount for p in projects if p.allocated_amount)
    if total_expenditure < 1000: 
        print("  -> Total expenditure too low to analyze concentration. Skipping.")
        return
    contractor_spending = {}
    for p in projects:
        if p.contractor_ngo_name and p.allocated_amount:
            contractor = p.contractor_ngo_name.strip()
            if contractor:
                contractor_spending[contractor] = contractor_spending.get(contractor, 0) + p.allocated_amount
    for contractor, amount in contractor_spending.items():
        percentage = (amount / total_expenditure) * 100
        if percentage > 40:
            print(f"  -> FOUND: High concentration for '{contractor}' ({percentage:.1f}%)")
            finding_text = f"A single contractor, '{contractor}', received {amount:,.0f} INR, which constitutes {percentage:.1f}% of the total reported expenditure. This can be a red flag for a lack of competitive bidding."
            insight = models.AIInsight(constituency_id=constituency_id, title="High Fund Concentration", finding=finding_text, severity="High")
            db.add(insight)
            db.flush()
            for proj in [p for p in projects if p.contractor_ngo_name and p.contractor_ngo_name.strip() == contractor]:
                db.add(models.Evidence(insight_id=insight.id, project_id=proj.id, reasoning=f"This project contributed {proj.allocated_amount:,.0f} INR to the total."))
    db.commit()

def _run_vagueness_agent(db: Session, constituency_id: int, projects: list):
    print("  [AUDIT AGENT 2/2] Running 'Vague Description' Agent...")
    project_context = "\n".join([f"ID {p.id}: {p.project_description}" for p in projects if p.project_description])
    if not project_context:
        print("  -> No project descriptions found to analyze. Skipping.")
        return
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = f"""
    Act as a forensic auditor. Your task is to identify projects with vague, non-specific, or suspicious descriptions from the following list.
    A vague description lacks specific details about the work, location, or purpose. Examples: "General works", "Constituency development", "Miscellaneous repairs".
    **List of Projects:**
    ---
    {project_context}
    ---
    Return a JSON object with a single key "vague_projects", containing a list of objects. Each object must have an "id" (the integer project ID) and a "reason" (a short explanation of why it's vague).
    Example: {{"vague_projects": [{{"id": 123, "reason": "Description 'Constituency development' lacks specific deliverables."}}]}}
    If no vague projects are found, return an empty list.
    """
    try:
        response = model.generate_content(prompt)
        results = json.loads(response.text.strip().replace("```json", "").replace("```", ""))
        vague_project_info = results.get("vague_projects", [])
        if vague_project_info:
            print(f"  -> FOUND: {len(vague_project_info)} projects with vague descriptions.")
            insight = models.AIInsight(constituency_id=constituency_id, title="Vague or Non-Specific Projects", finding=f"Found {len(vague_project_info)} projects with descriptions that lack specific details, which can make auditing their actual impact difficult.", severity="Medium")
            db.add(insight)
            db.flush()
            for item in vague_project_info:
                if 'id' in item and 'reason' in item:
                    db.add(models.Evidence(insight_id=insight.id, project_id=item['id'], reasoning=item['reason']))
        else:
            print("  -> No vague projects found by the AI.")
        db.commit()
    except Exception as e:
        print(f"  -> Vagueness Agent CRASHED. Could not parse AI response: {e}")
        db.rollback()

def run_full_ai_pipeline(db: Session, constituency_id: int, pdf_path: str):
    print(f"\n--- AI ENGINE: Starting full pipeline for Constituency ID: {constituency_id} ---")
    try:
        full_text = extract_text_from_pdf(pdf_path)
        if not full_text: raise Exception("OCR failed: No text extracted.")
        
        pages = full_text.split("--- End of Page ---\n\n")
        structured_projects_data = structure_data_with_gemini(pages)
        if not structured_projects_data: raise Exception("Gemini Structuring failed: No projects extracted.")
        
        db.query(models.Project).filter(models.Project.constituency_id == constituency_id).delete()
        db.commit()

        for proj_data in structured_projects_data:
            amount = 0.0
            try: amount = float(str(proj_data.get('allocated_amount', '0')).replace(',', ''))
            except (ValueError, TypeError): pass
            db.add(models.Project(constituency_id=constituency_id, project_description=proj_data.get('project_description'), allocated_amount=amount, location=proj_data.get('location'), contractor_ngo_name=proj_data.get('contractor_ngo_name'), category=proj_data.get('category', 'Other')))
        
        constituency = db.query(models.Constituency).filter(models.Constituency.id == constituency_id).first()
        if constituency:
            constituency.transparency_status = "Current"
            constituency.last_report_date = datetime.date.today()
        db.commit()

        run_high_accuracy_audit_pipeline(db, constituency_id)

        print("--- AI ENGINE: Pipeline successful ---\n")
        return {"message": "Processing successful"}
    except Exception as e:
        db.rollback()
        print(f"--- AI ENGINE: CRITICAL FAILURE in pipeline: {e} ---")
        constituency = db.query(models.Constituency).filter(models.Constituency.id == constituency_id).first()
        if constituency:
            constituency.transparency_status = "Missing"
            db.commit()
        raise e