# Prep4Future AI

Prep4Future AI is an AI-powered career readiness platform that helps job seekers improve their resumes, practice interviews, and get personalized career guidance from one dashboard.

The frontend is built with React, TypeScript, Vite, Tailwind CSS, and React Router. It connects to a FastAPI backend through the `VITE_API_URL` environment variable.

## Overview

Prep4Future AI guides users through the main stages of job preparation:

- Analyze a resume against a target job description.
- Identify missing skills, ATS gaps, and improvement opportunities.
- Generate personalized mock interview questions.
- Evaluate interview answers with AI feedback.
- Chat with an AI career coach for resume, interview, and career planning support.
- Export a career readiness report.

## Features

- **Resume Analyzer**: Upload a PDF resume, extract the content, and compare it with a job description.
- **AI Resume Feedback**: Get scores, strengths, weaknesses, missing keywords, and suggested improvements.
- **Mock Interview**: Generate role-specific questions based on job role, experience level, resume, and job description.
- **Answer Evaluation**: Submit interview answers and receive structured AI feedback.
- **Career Coach**: Chat with an AI assistant for career advice, preparation tips, and resume-based guidance.
- **Reports**: Generate and download a career readiness report.
- **Persistent State**: Saves app progress locally in the browser so users can continue their preparation.
- **Responsive Interface**: Dashboard-style layout with dedicated pages for each preparation workflow.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- Framer Motion
- jsPDF

## Local Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Logo And Branding

The visible website logo is loaded from:

```text
frontend/public/logo.svg
```

To change the logo, replace that file with your own `logo.svg`, or update the image path in:

```text
frontend/src/components/Layout/Sidebar.tsx
```

The browser tab icon is loaded from:

```text
frontend/public/favicon.svg
```

To change the favicon, replace `favicon.svg` with your own icon and keep the same filename, or update the favicon link in:

```text
frontend/index.html
```

For Vite public assets, files placed in the `public` folder are served from the site root. For example, `frontend/public/logo.svg` is used in code as `/logo.svg`.

## Deployment Notes

For Vercel deployment, set the frontend project root to:

```text
frontend
```

Use:

```bash
npm run build
```

Set the output directory to:

```text
dist
```

Add this environment variable in Vercel:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```
