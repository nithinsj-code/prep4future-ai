from fastapi import APIRouter
from pydantic import BaseModel
from services.groq_client import call_groq_chat

router = APIRouter()

class Message(BaseModel):
    role: str  # "user" | "assistant"
    content: str

class CoachRequest(BaseModel):
    messages: list[Message]
    resume_summary: str = ""

@router.post("/chat")
async def career_coach_chat(req: CoachRequest):
    resume_ctx = f"USER CONTEXT:\n{req.resume_summary}" if req.resume_summary else "No specific resume context provided yet."
    system = f"""You are Prep4Future AI Career Coach — an expert career advisor.
    You have access to the user's resume analysis and interview performance.
    Use the context below to provide specific, actionable advice.
    DO NOT ask the user for their resume, ATS score, or job target if it is already provided in the context below.

    {resume_ctx}"""

    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    reply = call_groq_chat(system, messages, max_tokens=1000)
    return {"reply": reply}
