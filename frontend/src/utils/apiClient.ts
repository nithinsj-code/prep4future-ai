import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60s — LLM calls can be slow
  headers: { "Content-Type": "application/json" },
});

// Interceptor for cold starts
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response || err.code === "ECONNABORTED") {
      throw new Error("Could not reach the backend. Check VITE_API_URL, CORS, or wait for Render to wake up.");
    }
    return Promise.reject(err);
  }
);

// Resume API
export const resumeAPI = {
  extract: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/resume/extract", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  analyze: (resumeText: string, jobDescription: string) =>
    api.post("/api/resume/analyze", { resume_text: resumeText, job_description: jobDescription }),
};

// Interview API
export const interviewAPI = {
  generateQuestions: (jobRole: string, experienceLevel: string, resumeText: string, jobDescription: string = "") =>
    api.post("/api/interview/questions", {
      job_role: jobRole,
      experience_level: experienceLevel,
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  evaluateAnswer: (question: string, answer: string, jobRole: string, experienceLevel: string) =>
    api.post("/api/interview/evaluate", {
      question,
      answer,
      job_role: jobRole,
      experience_level: experienceLevel,
    }),
};

// Coach API
export const coachAPI = {
  chat: (messages: { role: string; content: string }[], resumeSummary: string = "") =>
    api.post("/api/coach/chat", { messages, resume_summary: resumeSummary }),
};
