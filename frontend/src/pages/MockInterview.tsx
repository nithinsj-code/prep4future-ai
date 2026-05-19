import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Mic, MicOff, Send, ArrowLeft, CheckCircle2, Star, MessageCircle, AlertCircle } from 'lucide-react';
import { interviewAPI } from '../utils/apiClient';
import { useAppContext } from '../context/AppContext';

const MockInterview: React.FC = () => {
  const { state, startInterview, addInterviewAnswer, completeInterview } = useAppContext();
  const [step, setStep] = useState<'setup' | 'interview' | 'results'>(state.interview.isComplete ? 'results' : 'setup');
  const [jobRole, setJobRole] = useState(state.interview.jobRole || "");
  const [experienceLevel, setExperienceLevel] = useState(state.interview.experienceLevel || "Junior");
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setAnswer(transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const response = await interviewAPI.generateQuestions(jobRole, experienceLevel, state.resume.text, jobDescription);
      startInterview(jobRole, experienceLevel, response.data.questions);
      setStep('interview');
      setCurrentQuestionIdx(0);
    } catch (error: any) {
      console.error("Failed to generate questions", error);
      const errorMsg = error.response?.data?.detail || "Failed to start interview. Please try again.";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    setIsEvaluating(true);
    const question = state.interview.questions[currentQuestionIdx];
    try {
      const response = await interviewAPI.evaluateAnswer(
        question.question,
        answer,
        jobRole,
        experienceLevel
      );
      addInterviewAnswer(question.id, answer, response.data);
      setAnswer("");

      if (currentQuestionIdx < state.interview.questions.length - 1) {
        setCurrentQuestionIdx(prev => prev + 1);
      } else {
        completeInterview();
        setStep('results');
      }
    } catch (error) {
      console.error("Evaluation failed", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!state.resume.analysisResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 md:py-20 text-center animate-fade-up">
        <div className="w-20 h-20 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm shrink-0">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Resume Analysis Required</h2>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm md:text-base">
          To provide a realistic mock interview, our AI needs to understand your experience and the target job description first.
        </p>
        <Button onClick={() => window.location.href = '/resume'} className="h-12 md:h-14 px-8 text-base md:text-lg shadow-lg shadow-primary/20">
          Analyze My Resume Now
        </Button>
      </div>
    );
  }

  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12 animate-fade-up">
        <h1 className="text-3xl md:text-4xl tracking-tight mb-6 md:mb-8 text-center font-bold text-slate-900">Mock Interview Setup</h1>
        <Card className="p-5 sm:p-8 border-slate-200 shadow-xl shadow-slate-100">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Target Job Role</label>
              <input
                className="input-field w-full"
                placeholder="e.g. Senior Frontend Engineer"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Experience Level</label>
              <select
                className="input-field w-full appearance-none bg-white"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="Junior">Junior (0-2 years)</option>
                <option value="Mid">Mid-level (3-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Job Description (Optional but recommended)</label>
              <textarea
                className="input-field w-full h-32 resize-none"
                placeholder="Paste the JD here to get tailored questions..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <Button
                className="w-full h-12 md:h-14 text-base md:text-lg shadow-lg shadow-primary/20"
                onClick={handleStart}
                isLoading={isLoading}
                disabled={!jobRole}
              >
                Launch AI Interview
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (step === 'interview') {
    const question = state.interview.questions[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / state.interview.questions.length) * 100;

    return (
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
          <Button variant="outline" onClick={() => setStep('setup')} className="gap-2 self-start shrink-0">
            <ArrowLeft size={18} /> Exit Interview
          </Button>
          <div className="flex-1 w-full max-w-md sm:mx-8">
            <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">
              <span>Question {currentQuestionIdx + 1} of {state.interview.questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <Card className="mb-6 md:mb-8 p-6 sm:p-8 md:p-12 border-slate-200">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center shrink-0">
              <MessageCircle size={24} />
            </div>
            <div>
              <div className="flex gap-2 mb-3">
                <span className="px-2 py-0.5 bg-slate-100 text-[10px] rounded uppercase tracking-wider font-bold text-slate-500">{question.category}</span>
                <span className="px-2 py-0.5 bg-slate-100 text-[10px] rounded uppercase tracking-wider font-bold text-slate-500">{question.difficulty}</span>
              </div>
              <h2 className="text-xl md:text-2xl leading-relaxed text-slate-900 font-bold">{question.question}</h2>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <div className="relative">
            <textarea
              className="input-field w-full h-48 pt-4 pb-16 resize-none text-base md:text-lg leading-relaxed shadow-sm"
              placeholder="Your answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-4 rounded-full transition-all shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-slate-900'}`}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              {isListening && <span className="text-red-500 text-sm font-semibold">Recording answer...</span>}
            </div>
          </div>

          <Button
            className="w-full h-12 md:h-14 text-base md:text-lg"
            onClick={handleSubmitAnswer}
            isLoading={isEvaluating}
            disabled={!answer.trim()}
          >
            Submit Answer <Send size={20} className="shrink-0" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl tracking-tight font-bold text-slate-900">Interview Performance</h1>
        <Button onClick={() => setStep('setup')} className="self-start">Start New Session</Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {state.interview.questions.map((q) => {
          const evalData = state.interview.evaluations[q.id];
          if (!evalData) return null;
          return (
            <Card key={q.id} className="p-5 sm:p-8 border-slate-200 shadow-sm">
              <div className="flex items-start justify-between gap-8">
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Question</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(10)].map((_, i) => (
                        <Star key={i} size={12} fill={i < evalData.score ? "currentColor" : "none"} className={i < evalData.score ? "text-amber-400" : "text-slate-100"} />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl mb-6 font-bold text-slate-900">{q.question}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-green-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <CheckCircle2 size={14} /> Strengths
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">{evalData.what_was_good}</p>
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-bold text-red-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                          <AlertCircle size={14} /> Improvements
                        </p>
                        <p className="text-slate-600 text-sm leading-relaxed">{evalData.what_to_improve}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-100">
                      <p className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest mb-3">Coach's Advice</p>
                      <p className="text-sm italic text-slate-500 mb-4">"{evalData.feedback}"</p>
                      <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Model Answer Hint</p>
                      <p className="text-slate-700 text-sm leading-relaxed">{evalData.model_answer_hint}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MockInterview;
