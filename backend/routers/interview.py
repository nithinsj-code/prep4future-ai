from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import call_groq_json

router = APIRouter()

class QuestionsRequest(BaseModel):
    job_role: str
    experience_level: str  # Junior | Mid | Senior
    resume_text: str = ""
    job_description: str = ""

class EvaluateRequest(BaseModel):
    question: str
    answer: str
    job_role: str
    experience_level: str

@router.post("/questions")
async def generate_questions(req: QuestionsRequest):
    system = "You are a senior technical interviewer at a top tech company. Generate realistic, role-specific interview questions. Respond ONLY in valid JSON."

    user = f"""Generate 8 interview questions for a {req.experience_level} {req.job_role} candidate.

The candidate is applying for a role with this Job Description:
{req.job_description if req.job_description else "Not provided"}

The candidate's Resume context:
{req.resume_text[:1500] if req.resume_text else "Not provided"}

Instructions:
1. Tailor questions specifically to the Job Description requirements.
2. Use the Resume to ask about specific projects or technologies mentioned.
3. Include a mix of technical and behavioral questions.

Return:
{{
  "questions": [
    {{"id": 1, "question": "...", "category": "behavioral|technical|situational", "difficulty": "easy|medium|hard"}},
    ...
  ]
}}"""

    return call_groq_json(system, user, max_tokens=1500)

@router.post("/evaluate")
async def evaluate_answer(req: EvaluateRequest):
    system = "You are an expert interview coach who gives honest, constructive feedback. Respond ONLY in valid JSON."

    user = f"""Evaluate this interview answer for a {req.experience_level} {req.job_role} role.

Question: {req.question}
Candidate's Answer: {req.answer}

Return:
{{
  "score": <integer 0-10>,
  "feedback": "<overall assessment>",
  "what_was_good": "<specific strengths>",
  "what_to_improve": "<specific areas to improve>",
  "model_answer_hint": "<what a great answer would include>",
  "follow_up_question": "<natural follow-up question>"
}}"""

    return call_groq_json(system, user, max_tokens=800)
