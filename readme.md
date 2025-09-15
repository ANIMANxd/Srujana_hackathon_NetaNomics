# NetāNomics: The AI-Powered Public Accountability Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B8?style=for-the-badge&logo=google&logoColor=white)](https://ai.google/discover/gemini/)

**Netā-Nomics is a full-stack, AI-driven platform designed to close the transparency gap in Indian public finance. It transforms thousands of opaque, unstructured MPLADS expenditure reports into a searchable, interactive, and actionable national database.**

---

## 1. The Problem: The ₹2,700 Crore Black Box

Every year, billions of rupees are disbursed through the Members of Parliament Local Area Development Scheme (MPLADS) for local development projects. However, this critical financial data is locked away in a chaotic ecosystem of:

-   Inconsistent, non-standardized PDF reports.
-   Scanned documents and low-quality images.
-   Disparate, difficult-to-navigate government websites.

For journalists, researchers, and citizens, trying to follow the money is a near-impossible manual task. This creates a massive **transparency gap** where public accountability should be, leaving critical questions unanswered: Is the money being spent on the right things? Is it a fair price? Or is it being wasted?

![National Scorecard Screenshot](https://i.imgur.com/w2Q4Y8M.png)

## 2. Our Solution: An End-to-End AI Pipeline

Netā-Nomics is not just a dashboard; it's a complete, automated pipeline that turns chaos into clarity. It provides a single source of truth for public spending and empowers users to take meaningful action.

### Core Architecture
1.  **Automated Ingestion:** A Python-based service monitors a designated `report_inbox` for new expenditure reports. This robust, decoupled architecture ensures the core AI pipeline is resilient to changes in government website designs.
2.  **AI Data Structuring:** Using **Tesseract OCR** and the **Google Gemini API**, our backend performs deep content analysis. It intelligently extracts and structures every project detail—description, amount, location, and contractor—into a clean, queryable format using a stable batch-processing strategy to manage API rate limits.
3.  **Centralized Database:** All structured data is stored in a robust **PostgreSQL** database, managed via SQLAlchemy, creating a persistent and scalable national record of MPLADS projects.
4.  **High-Performance API:** A **FastAPI** backend serves the processed data and provides endpoints for our advanced AI features.
5.  **Interactive Frontend:** A dynamic and responsive frontend built with **Next.js**, **React**, and **Tailwind CSS** provides an intuitive user experience for data exploration, featuring dashboards and interactive components.

## 3. Key Features 

Netā-Nomics moves beyond simple data visualization to provide powerful, AI-driven tools for investigation and action.

### Feature A: The AI Forensic Investigator
Our platform's most powerful analysis tool. The AI doesn't just process data; it audits it for red flags.
-   **Multi-Agent System:** Specialized AI agents perform targeted checks for issues like high fund concentration to a single contractor or vague, unauditable project descriptions.
-   **Evidence-Backed Findings:** Every insight generated is programmatically linked to the specific projects in the database that serve as evidence.
-   **Interactive Deep Dives:** Users can click on any AI-generated insight to trigger a **second AI agent**. This agent performs a "deep dive," using the linked evidence to generate a detailed investigative brief, complete with data-driven questions a journalist could ask the official.

### Feature B: The "AI District Commissioner"
This feature moves from reactive analysis to proactive governance. It answers the question: "Was this money spent wisely?"
-   **Optimal Budget Generation:** The user can click a button to invoke an AI agent acting as a public policy expert. Given a constituency's profile, the AI generates an optimal, needs-based budget allocation.
-   **Instant Visual Comparison:** The platform displays the MP's actual spending pie chart next to the AI's ideal budget pie chart, instantly highlighting potential policy misalignments and neglect of key sectors like education or healthcare.

### Feature C: The AI-Powered Legal Assistant
What happens when data is missing? Netā-Nomics turns a dead end into an action plan.
-   **Guided Civic Action:** For constituencies with "Missing" or "Outdated" reports, our **Accountability Action Hub** provides a clear, multi-level escalation path, from a simple email to legal action.
-   **Automated Document Generation:** The AI Legal Assistant uses Gemini to generate:
    1.  A legally-vetted **RTI (Right to Information) Application** to formally demand the data.
    2.  A pre-emptive **First Appeal** document for when the government fails to respond.
    3.  A preliminary **PIL (Public Interest Litigation) Brief** for a lawyer to evaluate.

---

## 4. Tech Stack

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Frontend**  | Next.js, React, TypeScript, Tailwind CSS, Recharts |
| **Backend**   | Python, FastAPI, SQLAlchemy                 |
| **Database**  | PostgreSQL                                    |
| **AI / OCR**  | Google Gemini API, Tesseract OCR, Poppler     |
| **Deployment**| Vercel (Frontend), Docker (Backend)           |

---

## 5. Getting Started & Local Setup

### Prerequisites
-   Node.js (v18+) and npm
-   Python (v3.10+) and pip
-   PostgreSQL server
-   Tesseract OCR installed and accessible in your system's PATH.
-   Poppler (for `pdf2image`) installed and accessible in your system's PATH.
-   A Google AI API Key with the "Generative Language API" enabled.

### Backend Setup
1.  **Clone the repository and navigate to the backend:**
    ```bash
    git clone https://your-repo-url.git
    cd Srujana_hackathon_NetaNomics/backend
    ```
2.  **Create a virtual environment and install dependencies:**
    ```bash
    python -m venv venv
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    # source venv/bin/activate
    pip install -r requirements.txt
    ```
3.  **Configure Environment Variables:**
    -   Create a file named `.env` in the `backend` directory.
    -   Add your database URL and Google API key:
        ```env
        DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
        GOOGLE_API_KEY="YOUR_GEMINI_API_KEY_HERE"
        ```
4.  **Setup the Database:**
    -   Ensure your PostgreSQL server is running and you've created the database.
    -   Run the seeder script to create tables and populate initial data:
        ```bash
        python seed_db.py
        ```
5.  **Run the Backend Server:**
    ```bash
    uvicorn main:app --reload --port 8000
    ```
    The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup
1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    -   Create a file named `.env.local` in the `frontend` directory.
    -   Add the URL of your running backend API:
        ```env
        NEXT_PUBLIC_API_URL="http://127.0.0.1:8000"
        ```
4.  **Run the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

---

## 6. Future Roadmap

-   **Conflict-of-Interest Detection:** Integrate MP financial disclosures from the Election Commission of India to automatically flag potential conflicts of interest with awarded contractors.
-   **Real-time Tender Integration:** Connect to the Central Public Procurement Portal (CPPP) to cross-reference contractors with live government tenders and flag bid-rigging anomalies.
-   **National-Scale Historical Analysis:** Expand the data pipeline to cover all 543 constituencies and historical reports to perform powerful trend analysis over time.