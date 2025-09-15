import google.generativeai as genai
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.schemas import schemas

router = APIRouter(
    prefix="/api/v1/legal",
    tags=["Legal Assistant"]
)

# Helper function to get the correct PIO Address (can be expanded later)
def get_pio_address(constituency_name: str) -> str:
    """Returns the formatted address for the Public Information Officer."""
    return f"Public Information Officer (PIO),\nOffice of the District Magistrate,\n{constituency_name} District"

@router.post("/generate-docs", response_model=schemas.LegalDocsResponse)
def generate_all_legal_documents(request: schemas.LegalRequest):
    """
    Generates a full suite of legal documents: an RTI application,
    a First Appeal, and a preliminary PIL brief for a lawyer.
    """
    pio_address = get_pio_address(request.constituency_name)

    try:

        model = genai.GenerativeModel("gemini-2.0-flash")

        # --- Prompt 1: The RTI Application ---
        rti_prompt = f"""
        Act as a legal expert specializing in India's Right to Information (RTI) Act, 2005.
        Your task is to draft a formal RTI application based on the following finding.

        **Finding:** The MPLADS expenditure report for the {request.constituency_name} Lok Sabha constituency (MP: {request.mp_name}) is '{request.finding}'.
        **Target PIO Address:** {pio_address}

        Draft a concise, legally sound, and ready-to-file RTI application. The request must be specific, referencing the scheme and the exact information required as per the finding.
        The response should ONLY contain the raw text of the application, starting with "To," and ending with "Sincerely,". Do not add any conversational text, explanations, or markdown formatting.
        """
        
        # --- Prompt 2: The First Appeal ---
        appeal_prompt = f"""
        Now, act as a senior RTI activist coaching a citizen. The PIO has likely given an evasive or invalid response to the previous RTI request about '{request.finding}' for the {request.constituency_name} constituency.

        Draft the 'First Appeal' under Section 19(1) of the RTI Act to the First Appellate Authority at the same office. The appeal must:
        1. Reference the original (but unsent) RTI request.
        2. State that no satisfactory information was provided within the 30-day limit.
        3. Briefly argue why common evasions like "information is being compiled" are invalid under the RTI Act.
        
        The response must ONLY contain the raw text of the appeal. Do not add any conversational text.
        """

        # --- Prompt 3: The Public Interest Litigation (PIL) Brief ---
        pil_prompt = f"""
        Act as a paralegal for a public interest litigation lawyer. The finding is: '{request.finding}' for MP {request.mp_name} in {request.constituency_name}.
        
        Write a "Preliminary Note for Counsel" summarizing this issue in under 150 words. Explain in 2-3 sentences why a systemic failure in transparency for MPLADS funds could be a matter of public interest, potentially affecting the rights of the citizenry under Article 21 of the Constitution (Right to Life, which includes the right to live with dignity, contingent on proper governance). This is not the PIL itself, but a summary brief for a lawyer to evaluate the case.
        
        ONLY return the raw text of the brief.
        """

        rti_response = model.generate_content(rti_prompt)
        appeal_response = model.generate_content(appeal_prompt)
        pil_response = model.generate_content(pil_prompt)

        return schemas.LegalDocsResponse(
            rti_application=rti_response.text.strip(),
            first_appeal=appeal_response.text.strip(),
            pil_brief=pil_response.text.strip()
        )
    except Exception as e:

        print(f"AI Model or Generation Error: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while generating documents: {e}")