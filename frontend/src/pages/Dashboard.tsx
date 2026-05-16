import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { FileText, Mic2, MessageSquare, TrendingUp, CheckCircle2, Clock, BarChart3 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();

  const stats = [
    { label: 'Resume ATS Score', value: state?.resume?.analysisResult?.ats_score ?? '--', icon: FileText, color: 'text-blue-400' },
    { label: 'Interviews Done', value: state?.interview?.isComplete ? '1' : '0', icon: Mic2, color: 'text-green-400' },
    { label: 'Coach Messages', value: Math.max(0, (state?.coach?.messages?.length ?? 1) - 1), icon: MessageSquare, color: 'text-purple-400' },
    { label: 'Readiness Score', value: state?.resume?.analysisResult?.ats_score ? `${state.resume.analysisResult.ats_score}%` : '--', icon: TrendingUp, color: 'text-accent' },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl tracking-tight mb-2 text-slate-900">Welcome back</h1>
          <p className="text-slate-500">
            {state.resume.analysisResult
              ? "Your career profile is active. Ready for your next mock interview?"
              : "Get started by analyzing your resume to unlock personalized career coaching."}
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/resume')}>Analyze Resume</Button>
          <Button onClick={() => navigate('/interview')}>Start Mock Interview</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:border-primary/30 shadow-sm border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl mt-1 font-bold text-slate-900">{stat.value}</h3>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl tracking-tight text-slate-900 font-bold">Recent Activity</h2>
          <Card className="p-0 overflow-hidden border-slate-200">
            {!state.resume.analysisResult ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <FileText size={32} />
                </div>
                <p className="text-slate-500 font-medium">No activity yet.</p>
                <p className="text-slate-400 text-sm mt-1">Upload and analyze your resume to see results here.</p>
              </div>
            ) : (
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Resume Analysis Completed</p>
                    <p className="text-sm text-slate-500">{state.resume.fileName || "Resume File"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                    <Clock size={12} />
                    <span>Just now</span>
                  </div>
                  <p className="text-sm font-bold text-primary">ATS Score: {state.resume.analysisResult.ats_score}/100</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl tracking-tight text-slate-900 font-bold">Quick Actions</h2>
          <div className="space-y-4">
            <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200" onClick={() => navigate('/coach')}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-primary rounded-xl">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Ask Career Coach</p>
                  <p className="text-xs text-slate-500">Get instant career advice</p>
                </div>
              </div>
            </Card>
            <Card className="hover:bg-slate-50 transition-colors cursor-pointer border-slate-200" onClick={() => navigate('/reports')}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-primary rounded-xl">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">View Full Report</p>
                  <p className="text-xs text-slate-500">Download your performance PDF</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
