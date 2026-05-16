from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, interview, coach

app = FastAPI(title="Prep4Future API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://prep4future-ai.vercel.app",
        "https://prep4future.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/resume")
app.include_router(interview.router, prefix="/api/interview")
app.include_router(coach.router, prefix="/api/coach")

@app.get("/health")
def health():
    return {"status": "ok", "model": "llama-3.3-70b-versatile"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
