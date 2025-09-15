import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import google.generativeai as genai

# --- THIS IS THE BULLETPROOF SOLUTION ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # This code runs ONCE when the server starts up.
    print("--- Application Startup ---")
    print("-> Loading environment variables from .env file...")
    load_dotenv()
    
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("\n[FATAL STARTUP ERROR] GOOGLE_API_KEY not found!")
        print("-> Ensure .env file exists in the `backend` directory and is correctly formatted.\n")
    else:
        print("-> GOOGLE_API_KEY found. Configuring Google Gemini AI...")
        genai.configure(api_key=api_key)
        print("-> Google Gemini AI configured successfully.")
    
    print("--- Startup Complete. Uvicorn is ready. ---")
    yield
    # This code would run when the server shuts down.
# --- END OF SOLUTION ---

from app.database import engine
from app.models import models
from app.controllers import constituency_controller, processing_controller, rti_pil_controller, insight_controller, budget_controller

# This creates the tables if they don't exist
models.Base.metadata.create_all(bind=engine)

# Pass the lifespan manager to the FastAPI app
app = FastAPI(
    title="Netā-Nomics API",
    description="API for tracking MPLADS expenditure and transparency.",
    version="1.0.0",
    lifespan=lifespan # <-- CRITICAL LINE
)

# Your CORS Middleware
origins = ["http://localhost:3000", "http://localhost:3001"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all the routers
app.include_router(constituency_controller.router)
app.include_router(processing_controller.router)
app.include_router(rti_pil_controller.router)
app.include_router(insight_controller.router)
app.include_router(budget_controller.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Netā-Nomics API"}