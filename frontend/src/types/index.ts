export interface ResumeAnalysis {
  ats_score: number;
  keyword_matches: string[];
  missing_keywords: string[];
  section_scores: {
    summary: number;
    experience: number;
    skills: number;
    education: number;
  };
  strengths: string[];
  improvements: string[];
  overall_feedback: string;
  similarity_score?: number;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: "behavioral" | "technical" | "situational";
  difficulty: "easy" | "medium" | "hard";
}

export interface AnswerEvaluation {
  score: number;
  feedback: string;
  what_was_good: string;
  what_to_improve: string;
  model_answer_hint: string;
  follow_up_question: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface AppState {
  resume: {
    text: string;
    fileName: string;
    analysisResult: ResumeAnalysis | null;
  };
  interview: {
    jobRole: string;
    experienceLevel: string;
    questions: InterviewQuestion[];
    answers: { questionId: number; answer: string }[];
    evaluations: Record<number, AnswerEvaluation>;
    isComplete: boolean;
  };
  coach: {
    messages: Message[];
  };
}
