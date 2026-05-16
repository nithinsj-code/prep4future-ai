# Prep4Future AI

Prep4Future AI is a full-stack AI career preparation platform designed to help candidates move from resume upload to interview readiness in one focused workflow. It analyzes resumes against target job descriptions, identifies ATS and keyword gaps, generates personalized interview practice, evaluates answers, and provides career coaching through an AI-powered dashboard.

The project is built as a production-ready web application with a React + TypeScript frontend, a FastAPI backend, Groq-powered LLM responses, PDF resume extraction, persistent browser state, downloadable reports, and deployment support for Vercel and Render.

## What Makes It Powerful

- **End-to-End Career Readiness Flow**: Users can upload a resume, paste a job description, receive AI feedback, practice mock interviews, chat with a career coach, and export reports without switching tools.
- **AI Resume Intelligence**: The platform evaluates resumes like a career coach and ATS reviewer, highlighting strengths, missing keywords, section-level feedback, and practical improvements.
- **Job-Specific Feedback**: Resume analysis and interview questions are tailored to the exact target job description instead of giving generic advice.
- **Mock Interview Generator**: Prep4Future AI creates role-specific technical, behavioral, and situational questions based on role, experience level, resume context, and job description.
- **Answer Evaluation System**: Candidate responses are scored with feedback, improvement areas, model-answer hints, and follow-up questions.
- **AI Career Coach**: A chat-based coach helps users refine answers, understand career gaps, plan preparation, and act on resume/interview insights.
- **Career Readiness Reports**: Users can review performance summaries and export a PDF report for tracking progress.
- **Fresh Session Reset**: A user can clear all resume, interview, coach, and report data to start clean with another resume or job target.
- **Deployment Ready**: The frontend is configured for Vercel, and the backend is configured for Render with environment-based secrets.

## Core Features

### Resume Analyzer

- Upload PDF resumes.
- Extract text using backend PDF parsing with browser-side fallback.
- Paste or edit extracted resume text manually.
- Compare resume content against a job description.
- Generate an ATS-style score.
- Detect matched and missing keywords.
- Provide section-wise scoring for summary, experience, skills, and education.
- Show a semantic match score between resume and job description.
- Suggest concrete resume improvements.

### Mock Interview

- Generate questions for junior, mid-level, or senior roles.
- Use resume context and job description to personalize questions.
- Support technical, behavioral, and situational question categories.
- Evaluate answers with AI-generated scoring and feedback.
- Track strengths, weaknesses, model answer hints, and follow-up prompts.

### Career Coach

- Chat with an AI career coach.
- Ask for interview preparation help.
- Improve resume bullet points and positioning.
- Get career planning guidance.
- Use resume and interview context for more personalized advice.

### Reports

- Summarize resume and interview performance.
- Display ATS score, keyword matches, and interview readiness.
- Export a PDF career readiness report.
- Preserve progress through local browser storage.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- Framer Motion
- PDF.js
- jsPDF

### Backend

- FastAPI
- Uvicorn
- Groq API
- Pydantic
- pdfplumber
- PyPDF2
- Lightweight text similarity scoring

### Deployment

- Vercel for frontend hosting
- Render for backend hosting
- GitHub for source control

## Project Structure

```text
prep4future-ai/
  backend/   FastAPI API, resume parsing, AI service calls
  frontend/  React dashboard, routing, UI, client-side PDF fallback
```

## Environment Setup

Real environment files are intentionally ignored by Git.

Backend:

```bash
cp backend/.env.example backend/.env
```

Add your Groq key:

```env
GROQ_API_KEY=your_real_key_here
```

Frontend:

```bash
cp frontend/.env.example frontend/.env.local
```

For local development:

```env
VITE_API_URL=http://localhost:8000
```

For production on Vercel:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

## Run Locally

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

```text
http://localhost:8000/health
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Deployment

Backend on Render:

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment Variable: `GROQ_API_KEY`

Frontend on Vercel:

- Root Directory: `frontend`
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL`

## Security Notes

- Real `.env` and `.env.local` files are ignored.
- API keys should be configured only in local environment files or hosting dashboards.
- Never commit real secrets to GitHub.

## Purpose

Prep4Future AI is built to make job preparation more structured, personalized, and actionable. Instead of giving candidates generic resume tips, it connects resume analysis, interview practice, and career coaching into one intelligent preparation system.
