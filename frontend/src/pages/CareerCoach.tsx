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
      <div className="max-w-2xl mx-auto py-20 text-center animate-fade-up">
        <div className="w-20 h-20 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Bot size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Interview Session Required</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          I'm your performance coach! To give you the best advice, I need to see how you handle a mock interview first.
        </p>
        <Button onClick={() => window.location.href = '/interview'} className="h-14 px-8 text-lg shadow-lg shadow-primary/20">
          Start Mock Interview
        </Button>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl tracking-tight mb-2 font-bold text-slate-900">Career Coach AI</h1>
          <p className="text-slate-500">Your personal mentor for career growth and strategy.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        <div className="flex-1 flex flex-col bg-white border border-border rounded-3xl overflow-hidden relative shadow-sm">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
            {state.coach.messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-50 text-primary' : 'bg-slate-50 text-slate-600'}`}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none shadow-md shadow-primary/10' : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-none'}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                    <Bot size={20} />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-50 border-t border-border">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-4">
              <input
                className="input-field flex-1 h-12 shadow-sm"
                placeholder="Ask anything about your career..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button type="submit" className="h-12 w-12 rounded-xl p-0" isLoading={isLoading}>
                <Send size={20} />
              </Button>
            </form>
          </div>
        </div>

        <div className="w-80 space-y-6 hidden xl:block">
          <Card className="border-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> Quick Prompts
            </h3>
            <div className="space-y-3">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
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
