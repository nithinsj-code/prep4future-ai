import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Send, User, Bot, Sparkles, MessageSquare } from 'lucide-react';
import { coachAPI } from '../utils/apiClient';
import { useAppContext } from '../context/AppContext';
import type { Message } from '../types';

const CareerCoach: React.FC = () => {
  const { state, addCoachMessage } = useAppContext();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "How can I improve my resume?",
    "Salary negotiation tips for FAANG",
    "Transition from Dev to Product",
    "Best certifications for 2024",
    "Prepare for a system design interview"
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.coach.messages]);

  const handleSend = async (content: string = input) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content };
    addCoachMessage(userMessage);
    setInput("");
    setIsLoading(true);

    try {
      // Pass rich resume context if available
      let resumeSummary = "";
      if (state.resume.analysisResult) {
        const { ats_score, keyword_matches, missing_keywords, strengths, improvements, overall_feedback } = state.resume.analysisResult;
        resumeSummary = `
          User's Resume Analysis Results:
          - ATS Score: ${ats_score}/100
          - Top Matched Skills: ${keyword_matches.join(", ")}
          - Missing Keywords: ${missing_keywords.join(", ")}
          - Key Strengths: ${strengths.join(". ")}
          - Areas for Improvement: ${improvements.join(". ")}
          - Overall AI Feedback: ${overall_feedback}

          Target Job Role: ${state.interview.jobRole || "Not specified"}
          Experience Level: ${state.interview.experienceLevel || "Not specified"}
        `;
      }

      const response = await coachAPI.chat([...state.coach.messages, userMessage], resumeSummary);
      addCoachMessage({ role: "assistant", content: response.data.reply });
    } catch (error: any) {
      console.error("Coach chat failed", error);
      const errorMsg = error.response?.data?.detail || "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.";
      addCoachMessage({ role: "assistant", content: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  if (!state.interview.isComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 md:py-20 text-center animate-fade-up">
        <div className="w-20 h-20 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm shrink-0">
          <Bot size={40} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Interview Session Required</h2>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm md:text-base">
          I'm your performance coach! To give you the best advice, I need to see how you handle a mock interview first.
        </p>
        <Button onClick={() => window.location.href = '/interview'} className="h-12 md:h-14 px-8 text-base md:text-lg shadow-lg shadow-primary/20">
          Start Mock Interview
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-130px)] md:h-[calc(100vh-160px)] flex flex-col animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl tracking-tight mb-1 font-bold text-slate-900">Career Coach AI</h1>
          <p className="text-sm md:text-base text-slate-500">Your personal mentor for career growth and strategy.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        <div className="flex-1 flex flex-col bg-white border border-border rounded-2xl sm:rounded-3xl overflow-hidden relative shadow-sm">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-6">
            {state.coach.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 sm:gap-4 max-w-[85%] sm:max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-50 text-primary' : 'bg-slate-50 text-slate-600'}`}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div className={`p-3 sm:p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/10' : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                    <Bot size={18} />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 bg-slate-50 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
              <input
                className="input-field flex-1 h-11 sm:h-12 shadow-sm text-sm"
                placeholder="Ask anything about your career..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl p-0 shrink-0" isLoading={isLoading}>
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>

        <div className="w-80 space-y-6 hidden xl:block shrink-0">
          <Card className="border-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> Quick Prompts
            </h3>
            <div className="space-y-3">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="w-full text-left p-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl border border-transparent hover:border-blue-100 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-primary/5 border-primary/10">
            <div className="flex items-center gap-3 mb-3 text-primary">
              <MessageSquare size={20} />
              <h3 className="font-bold">Context Aware</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              I can analyze your resume analysis results and provide specific suggestions to beat the competition.
            </p>
            <Button variant="outline" className="w-full py-2 text-xs" onClick={() => handleSend("Can you review my latest resume analysis?")}>Review Results</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerCoach;
