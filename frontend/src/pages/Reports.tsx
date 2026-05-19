import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, FileText, Mic2, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import jsPDF from 'jspdf';

const Reports: React.FC = () => {
  const { state } = useAppContext();
  const analysis = state.resume.analysisResult;
  const interviews = state.interview.evaluations;

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.text("Prep4Future AI - Career Readiness Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated for: Candidate | Date: ${new Date().toLocaleDateString()}`, 20, 30);

    // Resume Analysis
    doc.setFontSize(18);
    doc.text("Resume Performance", 20, 50);
    doc.setFontSize(12);
    doc.text(`ATS Score: ${analysis?.ats_score || 'N/A'}/100`, 20, 60);
    doc.text(`Similarity: ${analysis?.similarity_score || 'N/A'}%`, 20, 70);

    doc.text("Strengths:", 20, 85);
    analysis?.strengths?.forEach((s, i) => doc.text(`- ${s}`, 25, 92 + (i * 7)));

    doc.text("Missing Keywords:", 20, 120);
    analysis?.missing_keywords?.forEach((k, i) => doc.text(`- ${k}`, 25, 127 + (i * 7)));

    // Interview Performance
    doc.addPage();
    doc.setFontSize(18);
    doc.text("Interview Performance", 20, 20);

    let y = 35;
    state.interview.questions.forEach((q) => {
      const evalData = interviews[q.id];
      if (evalData) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Q: ${q.question}`, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(`Score: ${evalData.score}/10`, 20, y + 7);
        doc.text(`Feedback: ${evalData.feedback}`, 20, y + 14, { maxWidth: 170 });
        y += 35;
      }
    });

    doc.save("Prep4Future_Career_Report.pdf");
  };

  const hasData = !!analysis || Object.keys(interviews).length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 sm:p-12 animate-fade-up">
        <div className="w-24 h-24 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 shrink-0">
          <Award size={48} />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">No Reports Ready Yet</h1>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-8 text-sm md:text-base">
          To generate your comprehensive performance report, you first need to analyze your resume and complete at least one mock interview session.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Button onClick={() => window.location.href = '/resume'} className="w-full sm:w-auto">Analyze Resume</Button>
          <Button variant="outline" onClick={() => window.location.href = '/interview'} className="w-full sm:w-auto">Go to Interview</Button>
        </div>
      </div>
    );
  }

  const avgInterviewScore = Object.values(interviews).length > 0
    ? (Object.values(interviews).reduce((sum, e) => sum + e.score, 0) / Object.values(interviews).length).toFixed(1)
    : '--';

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl tracking-tight mb-2 font-bold text-slate-900">Performance Reports</h1>
          <p className="text-sm md:text-base text-slate-500">Comprehensive overview of your readiness for the job market.</p>
        </div>
        <Button onClick={handleExportPDF} className="gap-2 shadow-lg shadow-primary/20 self-start sm:self-auto shrink-0">
          <Download size={20} className="shrink-0" /> Export Full Report (PDF)
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-slate-200 p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">ATS Score</p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">{analysis?.ats_score || '--'}</p>
        </Card>
        <Card className="border-slate-200 p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Keyword Match</p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">{analysis?.keyword_matches.length || 0}</p>
        </Card>
        <Card className="border-slate-200 p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Avg. Interview Score</p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">{avgInterviewScore}/10</p>
        </Card>
        <Card className="border-slate-200 p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Interviews Done</p>
          <p className="text-2xl md:text-3xl font-bold text-slate-900">{Object.keys(interviews).length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Card className="border-slate-200 p-5 sm:p-6">
          <h3 className="text-lg md:text-xl mb-6 flex items-center gap-3 font-bold text-slate-900">
            <FileText size={20} className="text-primary shrink-0" /> Resume Summary
          </h3>
          <div className="space-y-4">
            {analysis ? (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Top Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.strengths.slice(0, 3).map((s, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 pt-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Top Skills Missing</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing_keywords.slice(0, 3).map((k, i) => (
                      <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-100">{k}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-slate-400 text-sm italic">Analyze your resume to see highlights here.</p>
            )}
          </div>
        </Card>

        <Card className="border-slate-200 p-5 sm:p-6">
          <h3 className="text-lg md:text-xl mb-6 flex items-center gap-3 font-bold text-slate-900">
            <Mic2 size={20} className="text-primary shrink-0" /> Interview Insights
          </h3>
          <div className="space-y-4">
            {Object.keys(interviews).length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Latest Feedback</p>
                  <p className="text-xs sm:text-sm text-slate-700 line-clamp-3">"{Object.values(interviews)[Object.values(interviews).length - 1].feedback}"</p>
                </div>
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl gap-2">
                   <span className="text-xs sm:text-sm font-semibold text-slate-700">Interview Readiness</span>
                   <span className="text-primary font-bold text-xs sm:text-sm">{Number(avgInterviewScore) > 7 ? 'High' : 'Improving'}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm italic">Complete a mock interview to see summary here.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
