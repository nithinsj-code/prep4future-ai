import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppState, ResumeAnalysis, InterviewQuestion, AnswerEvaluation, Message } from '../types';

interface AppContextType {
  state: AppState;
  setResumeText: (text: string, fileName: string) => void;
  setResumeAnalysis: (analysis: ResumeAnalysis) => void;
  startInterview: (jobRole: string, experienceLevel: string, questions: InterviewQuestion[]) => void;
  addInterviewAnswer: (questionId: number, answer: string, evaluation: AnswerEvaluation) => void;
  completeInterview: () => void;
  addCoachMessage: (message: Message) => void;
  clearState: () => void;
}

const initialState: AppState = {
  resume: {
    text: "",
    fileName: "",
    analysisResult: null,
  },
  interview: {
    jobRole: "",
    experienceLevel: "",
    questions: [],
    answers: [],
    evaluations: {},
    isComplete: false,
  },
  coach: {
    messages: [
      { role: "assistant", content: "Hello! I'm your Prep4Future AI Career Coach. How can I help you today?" }
    ],
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('prep4future_state');
    if (!saved) return initialState;

    try {
      const parsed = JSON.parse(saved);
      // Basic merge to ensure top-level keys exist
      return {
        ...initialState,
        ...parsed,
        resume: { ...initialState.resume, ...(parsed.resume || {}) },
        interview: { ...initialState.interview, ...(parsed.interview || {}) },
        coach: { ...initialState.coach, ...(parsed.coach || {}) },
      };
    } catch (e) {
      console.error("Failed to parse saved state", e);
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem('prep4future_state', JSON.stringify(state));
  }, [state]);

  const setResumeText = (text: string, fileName: string) => {
    setState(prev => ({
      ...prev,
      resume: { ...prev.resume, text, fileName }
    }));
  };

  const setResumeAnalysis = (analysis: ResumeAnalysis) => {
    setState(prev => ({
      ...prev,
      resume: { ...prev.resume, analysisResult: analysis }
    }));
  };

  const startInterview = (jobRole: string, experienceLevel: string, questions: InterviewQuestion[]) => {
    setState(prev => ({
      ...prev,
      interview: {
        jobRole,
        experienceLevel,
        questions,
        answers: [],
        evaluations: {},
        isComplete: false
      }
    }));
  };

  const addInterviewAnswer = (questionId: number, answer: string, evaluation: AnswerEvaluation) => {
    setState(prev => ({
      ...prev,
      interview: {
        ...prev.interview,
        answers: [...prev.interview.answers, { questionId, answer }],
        evaluations: { ...prev.interview.evaluations, [questionId]: evaluation }
      }
    }));
  };

  const completeInterview = () => {
    setState(prev => ({
      ...prev,
      interview: { ...prev.interview, isComplete: true }
    }));
  };

  const addCoachMessage = (message: Message) => {
    setState(prev => ({
      ...prev,
      coach: { ...prev.coach, messages: [...prev.coach.messages, message] }
    }));
  };

  const clearState = () => {
    setState(initialState);
    localStorage.removeItem('prep4future_state');
  };

  return (
    <AppContext.Provider value={{
      state,
      setResumeText,
      setResumeAnalysis,
      startInterview,
      addInterviewAnswer,
      completeInterview,
      addCoachMessage,
      clearState
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
