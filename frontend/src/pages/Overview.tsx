import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Target, ShieldCheck, Zap, ArrowRight, BookOpen, MessageSquare } from 'lucide-react';

const Overview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto py-12 space-y-20 animate-fade-up">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Supercharge your <span className="text-primary">Career Readiness</span> <br /> with AI
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Prep4Future AI is a comprehensive career enhancement platform designed to help you land your dream job through data-driven resume analysis and realistic mock interviews.
        </p>
        <div className="pt-8">
          <Button onClick={() => navigate('/resume')} className="h-16 px-10 text-xl gap-3 shadow-xl shadow-primary/20">
            Get Started Now <ArrowRight size={24} />
          </Button>
        </div>
      </section>

      {/* Definition Section */}
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center justify-center gap-3">
           <BookOpen className="text-primary" /> What is Prep4Future?
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-6">
          Prep4Future AI is your 24/7 personal career coach. We've built a bridge between your current skills and your target role using the power of Large Language Models (LLMs) like Llama 3.3.
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-100 text-green-600 rounded-full"><ShieldCheck size={16} /></div>
            <p className="text-slate-700 font-semibold">ATS-Proofing</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-green-100 text-green-600 rounded-full"><ShieldCheck size={16} /></div>
            <p className="text-slate-700 font-semibold">Behavioral Sync</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section>
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">How to Use Prep4Future</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <Card key={i} className="border-slate-200 hover:border-primary/30 transition-all">
              <div className="text-5xl font-black text-primary mb-4 tracking-tighter">{item.step}</div>
              <div className="p-3 bg-blue-50 text-primary w-fit rounded-xl mb-4">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="bg-slate-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <h2 className="text-4xl font-bold mb-6">Why Choose Prep4Future?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-10 text-lg">
          In today's competitive market, applying blindly is not enough. We provide the competitive edge by simulating the exact experience of a real technical or behavioral interview.
        </p>
        <div className="flex flex-wrap justify-center gap-12">
          <div>
            <p className="text-4xl font-bold text-primary mb-1">Real-time</p>
            <p className="text-slate-500 text-sm">Speech-to-Text Analysis</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-1">Llama 3.3</p>
            <p className="text-slate-500 text-sm">State-of-the-art AI Brain</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-1">Personalized</p>
            <p className="text-slate-500 text-sm">Deep Resume Integration</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;
