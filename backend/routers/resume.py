from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from services.groq_client import call_groq_json
from services.nlp_service import compute_similarity
from PyPDF2 import PdfReader
import io
import pdfplumber

router = APIRouter()

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str


def _clean_text(text: str) -> str:
    return "\n".join(line.strip() for line in text.splitlines() if line.strip())


def _extract_with_pdfplumber(content: bytes) -> str:
    text_parts: list[str] = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text(x_tolerance=1, y_tolerance=3, layout=True)
            if extracted:
                text_parts.append(extracted)
    return _clean_text("\n".join(text_parts))


def _extract_with_pypdf2(content: bytes) -> str:
    text_parts: list[str] = []
    reader = PdfReader(io.BytesIO(content))
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text_parts.append(extracted)
    return _clean_text("\n".join(text_parts))


@router.post("/extract")
async def extract_resume_text(file: UploadFile = File(...)):
    """Extract text from uploaded PDF resume using multiple PDF parsers."""
    if file.content_type and file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")

    try:
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="The uploaded PDF is empty.")

        errors: list[str] = []
        text = ""

        for extractor_name, extractor in (
            ("pdfplumber", _extract_with_pdfplumber),
            ("PyPDF2", _extract_with_pypdf2),
        ):
            try:
                text = extractor(content)
            except Exception as e:
                errors.append(f"{extractor_name}: {str(e)}")
                continue

            if text:
                break

        if not text:
            detail = "No selectable text was found in this PDF. If it is a scanned/image resume, convert it with OCR or paste the resume text manually."
            if errors:
                detail += f" Parser details: {'; '.join(errors)}"
            raise HTTPException(
                status_code=422,
                detail=detail,
            )

        return {"text": text}
    except HTTPException:
        raise
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
