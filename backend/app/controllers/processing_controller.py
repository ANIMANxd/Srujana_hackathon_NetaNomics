from fastapi import APIRouter, HTTPException

from app.processor import process_inbox

router = APIRouter(
    prefix="/api/v1/process",
    tags=["Processing"]
)

@router.post("/run", summary="Trigger the inbox processor")
def trigger_processor():
    """
    Triggers the system to check the 'report_inbox' directory for new PDFs
    and runs the full AI pipeline on each one found.
    """
    try:
        result = process_inbox()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"A critical error occurred in the processor: {e}")