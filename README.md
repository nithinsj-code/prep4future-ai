# Prep4Future AI

Prep4Future AI is an AI-powered career readiness platform for resume analysis, mock interview preparation, career coaching, and readiness reports.

## Project Structure

```text
prep4future-ai/
  backend/   FastAPI backend
  frontend/  React + TypeScript + Vite frontend
```

## Environment Setup

Real environment files are intentionally ignored by Git.

Backend:

```bash
cp backend/.env.example backend/.env
```

Then add your real Groq API key in `backend/.env`:

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

For production on Vercel, set `VITE_API_URL` to your deployed Render backend URL.

## Backend

Install dependencies:

```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

Run locally:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

```text
http://localhost:8000/health
```

## Frontend

Install dependencies:

```bash
cd frontend
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Deployment

- Deploy the backend on Render using `backend/render.yaml`.
- Deploy the frontend on Vercel with root directory `frontend`.
- Add `GROQ_API_KEY` in Render environment variables.
- Add `VITE_API_URL` in Vercel environment variables.

Do not commit real `.env` or `.env.local` files.
