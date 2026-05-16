# Prep4Future AI Frontend

This is the React frontend for Prep4Future AI, an AI-powered career readiness dashboard for resume optimization, interview preparation, career coaching, and progress reporting.

The frontend is designed as a focused preparation workspace: users can upload a resume, review extracted content, paste a target job description, analyze their fit, practice interviews, chat with an AI career coach, export reports, and reset everything for a fresh session.

## Feature Highlights

- **Resume Upload Experience**: Upload a PDF resume and extract text directly into an editable workspace.
- **Browser PDF Fallback**: Uses PDF.js in the browser if backend extraction fails, improving reliability for different PDF formats.
- **AI Resume Analysis View**: Displays ATS score, semantic match, matched keywords, missing keywords, and improvement suggestions.
- **Job Description Targeting**: Lets users paste a specific role description so feedback is tailored to the real opportunity.
- **Mock Interview Workspace**: Generates interview questions based on role, experience level, resume context, and job description.
- **Answer Feedback Interface**: Shows AI-generated scoring, strengths, weaknesses, model-answer hints, and follow-up guidance.
- **Career Coach Chat**: Provides a conversational AI coach for preparation, resume improvement, interview strategy, and career planning.
- **Reports Dashboard**: Summarizes readiness and exports a PDF report using jsPDF.
- **Persistent Progress**: Saves app state in local storage so users can continue where they left off.
- **Fresh Session Reset**: Clears all resume, interview, coach, and report data when users want to prepare for a new job or upload another resume.
- **SPA Routing for Vercel**: Includes `vercel.json` rewrites so routes like `/resume`, `/interview`, and `/reports` work after refresh.

## Pages

- **Overview**: Introduces the workflow and guides users into preparation.
- **Resume Analyzer**: Handles PDF upload, extracted text editing, job description input, and AI scoring.
- **Mock Interview**: Creates custom interview sessions and evaluates answers.
- **Career Coach**: Offers chat-based career and preparation support.
- **Reports**: Presents summarized readiness insights and PDF export.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- PDF.js
- Lucide React
- Framer Motion
- jsPDF

## Local Setup

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:8000
```

Start development:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Branding

The sidebar logo and browser favicon use:

```text
frontend/public/logo.svg
```

The browser title is configured in:

```text
frontend/index.html
```

Public assets in Vite are served from the site root, so `frontend/public/logo.svg` is referenced as:

```text
/logo.svg
```

## Deployment On Vercel

Use these settings:

- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Add this environment variable:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

The project includes `vercel.json` for client-side routing fallback:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
