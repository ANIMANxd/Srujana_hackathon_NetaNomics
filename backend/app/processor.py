import os
import shutil
import time
import re
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.ai_pipeline import run_full_ai_pipeline
from app.models import models

DRY_RUN = False 


BACKEND_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
INBOX_DIR = os.path.join(BACKEND_ROOT, "report_inbox")
PROCESSED_DIR = os.path.join(BACKEND_ROOT, "processed_reports")
os.makedirs(INBOX_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)

def normalize_name(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '', name.lower())

def find_matching_constituency(filename: str, all_constituencies: list):
    normalized_filename = normalize_name(filename.split('.')[0])
    for const in all_constituencies:
        base_name = const.constituency_name.split('(')[0].strip()
        normalized_db_name = normalize_name(base_name)
        if normalized_filename.startswith(normalized_db_name):
            return const
    return None

def process_inbox():
    print("\n--- PROCESSOR: Checking for new reports in the inbox... ---")
    if DRY_RUN:
        print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print("!!! WARNING: RUNNING IN DRY_RUN MODE !!!")
        print("!!! NO API CALLS WILL BE MADE.       !!!")
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")

    db = SessionLocal()
    new_reports_processed = 0
    
    try:
        all_constituencies = db.query(models.Constituency).all()
        files_to_process = [f for f in os.listdir(INBOX_DIR) if f.lower().endswith('.pdf')]
        
        if not files_to_process:
            print("--- PROCESSOR: Inbox is empty. Nothing to do. ---")
            return {"status": "success", "message": "Inbox empty", "new_reports_processed": 0}

        for filename in files_to_process:
            file_path = os.path.join(INBOX_DIR, filename)
            print(f"\n--- PROCESSOR: Found new report: '{filename}' ---")
            
            constituency = find_matching_constituency(filename, all_constituencies)
            
            if not constituency:
                print(f"    - WARNING: No matching constituency. Moving to processed.")
                shutil.move(file_path, os.path.join(PROCESSED_DIR, f"UNRECOGNIZED_{filename}"))
                continue

            print(f"    - Matched to Constituency: '{constituency.constituency_name}' (ID: {constituency.id})")

            if DRY_RUN:
                print("    - [DRY RUN] Skipping AI Pipeline to save API quota.")
   
                constituency.transparency_status = "Current"
                db.commit()
            else:
                run_full_ai_pipeline(db, constituency.id, file_path)
            
            new_reports_processed += 1
            
            archive_filename = f"{filename.replace('.pdf', '')}_{int(time.time())}.pdf"
            archive_path = os.path.join(PROCESSED_DIR, archive_filename)
            shutil.move(file_path, archive_path)
            print(f"    - Successfully processed and archived report.")

    except Exception as e:
        print(f"--- PROCESSOR: A CRITICAL ERROR occurred: {e} ---")
        raise e
    finally:
        db.close()
        
    print(f"\n--- PROCESSOR: Finished. Processed {new_reports_processed} new reports. ---")
    return {"status": "success", "new_reports_processed": new_reports_processed}