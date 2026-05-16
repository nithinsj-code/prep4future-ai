from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.groq_client import call_groq_json
from services.nlp_service import compute_similarity
import pdfplumber, io

router = APIRouter()

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str

@router.post("/extract")
async def extract_resume_text(file: UploadFile = File(...)):
    """Extract text from uploaded PDF resume using pdfplumber."""
    try:
        content = await file.read()
        text = ""
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"

        if not text.strip():
            # Fallback to a simpler extraction if pdfplumber fails
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. It might be an image-only PDF.")

        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF Extraction failed: {str(e)}")

@router.post("/analyze")
async def analyze_resume(req: AnalyzeRequest):
    system = """You are an expert ATS resume analyst and career coach with 15 years of experience.
    Analyze resumes deeply and provide accurate, actionable feedback. Respond ONLY in valid JSON."""

    user = f"""Analyze this resume against the job description and return a JSON object.

Resume:
{req.resume_text}

Job Description:
{req.job_description}

Return exactly this JSON structure:
{{
  "ats_score": <integer 0-100>,
  "keyword_matches": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "section_scores": {{
    "summary": <0-100>,
    "experience": <0-100>,
    "skills": <0-100>,
    "education": <0-100>
  }},
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["suggestion1", "suggestion2", "suggestion3"],
  "overall_feedback": "<2-3 sentence professional summary>"
}}"""

    try:
        result = call_groq_json(system, user, max_tokens=1500)

        # Augment with NLP similarity score
        similarity = compute_similarity(req.resume_text, req.job_description)
        result["similarity_score"] = round(similarity * 100, 1)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
