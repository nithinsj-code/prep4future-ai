import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Target, ShieldCheck, Zap, ArrowRight, BookOpen, MessageSquare } from 'lucide-react';

const Overview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-20 animate-fade-up">
      {/* Hero Section */}
      <section className="text-center space-y-4 md:space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Supercharge your <span className="text-primary">Career Readiness</span> <br className="hidden sm:inline" /> with AI
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Prep4Future AI is a comprehensive career enhancement platform designed to help you land your dream job through data-driven resume analysis and realistic mock interviews.
        </p>
        <div className="pt-4 md:pt-8">
          <Button onClick={() => navigate('/resume')} className="h-14 md:h-16 px-6 md:px-10 text-lg md:text-xl gap-3 shadow-xl shadow-primary/20">
            Get Started Now <ArrowRight size={24} className="shrink-0" />
          </Button>
        </div>
      </section>

      {/* Definition Section */}
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 md:mb-6 flex items-center justify-center gap-3">
           <BookOpen className="text-primary" /> What is Prep4Future?
        </h2>
        <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6">
          Prep4Future AI is your 24/7 personal career coach. We've built a bridge between your current skills and your target role using the power of Large Language Models (LLMs) like Llama 3.3.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-100 text-green-600 rounded-full"><ShieldCheck size={16} /></div>
            <p className="text-slate-700 font-semibold text-sm md:text-base">ATS-Proofing</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-100 text-green-600 rounded-full"><ShieldCheck size={16} /></div>
            <p className="text-slate-700 font-semibold text-sm md:text-base">Behavioral Sync</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 md:mb-12 text-center">How to Use Prep4Future</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              step: "01",
              title: "Analyze Resume",
              desc: "Upload your PDF and paste the Job Description. Our AI extracts your core skills and identifies gaps.",
              icon: Target
            },
            {
              step: "02",
              title: "Practice Mock Interview",
              desc: "Launch a custom interview session. The AI uses your specific resume and the JD to grill you on what matters.",
              icon: Zap
            },
            {
              step: "03",
              title: "Get AI Coaching",
              desc: "Chat with your Career Coach to refine your answers, negotiate salaries, and plan your next 5 years.",
              icon: MessageSquare
            }
          ].map((item, i) => (
            <Card key={i} className="border-slate-200 hover:border-primary/30 transition-all p-6 md:p-8">
              <div className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tighter">{item.step}</div>
              <div className="p-3 bg-blue-50 text-primary w-fit rounded-xl mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-slate-900 rounded-3xl md:rounded-[3rem] p-6 sm:p-12 md:p-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">Why Choose Prep4Future?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10 text-base md:text-lg">
          In today's competitive market, applying blindly is not enough. We provide the competitive edge by simulating the exact experience of a real technical or behavioral interview.
        </p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-12">
          <div>
            <p className="text-2xl md:text-4xl font-bold text-primary mb-1">Real-time</p>
            <p className="text-slate-500 text-[10px] md:text-xs">Speech-to-Text Analysis</p>
          </div>
          <div>
            <p className="text-2xl md:text-4xl font-bold text-primary mb-1">Llama 3.3</p>
            <p className="text-slate-500 text-[10px] md:text-xs">State-of-the-art AI Brain</p>
          </div>
          <div>
            <p className="text-2xl md:text-4xl font-bold text-primary mb-1">Personalized</p>
            <p className="text-slate-500 text-[10px] md:text-xs">Deep Resume Integration</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
