import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { resumeAPI } from '../utils/apiClient';
import { useAppContext } from '../context/AppContext';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const extractPdfInBrowser = async (file: File): Promise<string> => {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText) {
      pages.push(pageText);
    }
  }

  return pages.join('\n\n').trim();
};

const ResumeAnalyzer: React.FC = () => {
  const { state, setResumeText, setResumeAnalysis } = useAppContext();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [extractedText, setExtractedText] = useState(state.resume.text || "");
  const [fileName, setFileName] = useState(state.resume.fileName || "");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsExtracting(true);
    try {
      const response = await resumeAPI.extract(file);
      setExtractedText(response.data.text);
      setResumeText(response.data.text, file.name);
    } catch (error: any) {
      console.error("Extraction failed", error);
      try {
        const browserText = await extractPdfInBrowser(file);
        if (browserText) {
          setExtractedText(browserText);
          setResumeText(browserText, file.name);
          return;
        }
      } catch (browserError) {
        console.error("Browser PDF extraction failed", browserError);
      }

      const errorMsg = error.response?.data?.detail || "Failed to extract text from PDF. Please paste it manually.";
      alert(errorMsg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!extractedText || !jobDescription) return;

    setIsAnalyzing(true);
    try {
      const response = await resumeAPI.analyze(extractedText, jobDescription);
      setResumeAnalysis(response.data);
    } catch (error: any) {
      console.error("Analysis failed", error);
      const errorMsg = error.response?.data?.detail || error.message || "Analysis failed. Please check your connection and try again.";
      alert(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analysis = state.resume.analysisResult;

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl tracking-tight mb-2 text-slate-900">Resume Intelligence</h1>
          <p className="text-slate-500">Optimize your resume for ATS and land your dream job.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Input */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">1. Resume Content</h3>
              {fileName && (
                <span className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle size={12} /> {fileName}
                </span>
              )}
            </div>
            <label className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all group mb-4">
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isExtracting ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-sm">Upload New PDF</p>
                  <p className="text-xs text-slate-500">Max 5MB</p>
                </div>
              </div>
            </label>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Extracted Text (Edit if needed)</label>
              <textarea
                className="input-field w-full h-40 text-sm resize-none"
                placeholder="Upload a PDF or paste your resume text here..."
                value={extractedText}
                onChange={(e) => {
                  setExtractedText(e.target.value);
                  setResumeText(e.target.value, fileName || "Pasted Resume");
                }}
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-xl mb-4 font-bold text-slate-900">2. Job Description</h3>
            <textarea
              className="input-field w-full h-40 resize-none"
              placeholder="Paste the target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <Button
              className="w-full mt-4 h-14 text-lg shadow-lg shadow-primary/20"
              onClick={handleAnalyze}
              isLoading={isAnalyzing}
              disabled={!extractedText || !jobDescription}
            >
              Analyze Resume Performance <ArrowRight size={20} />
            </Button>
          </Card>
        </div>

        {/* Right Panel: Results */}
        <div className="space-y-6">
          {!analysis ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border rounded-2xl">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <FileText size={40} className="text-slate-300" />
              </div>
              <h3 className="text-2xl mb-2 font-bold text-slate-900">Awaiting Analysis</h3>
              <p className="max-w-xs mx-auto text-slate-500">Upload your resume and paste a job description to see your detailed ATS score and feedback.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-up">
              <Card className="flex items-center justify-between p-8 overflow-visible border-slate-200">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64" cy="64" r="58"
                      stroke="currentColor" strokeWidth="12" fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="64" cy="64" r="58"
                      stroke="currentColor" strokeWidth="12" fill="transparent"
                      strokeDasharray={364.42}
                      strokeDashoffset={364.42 - (364.42 * analysis.ats_score) / 100}
                      className="text-primary transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">{analysis.ats_score}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">ATS Score</span>
                  </div>
                </div>

                <div className="flex-1 ml-8">
                  <h3 className="text-2xl mb-1 font-bold text-slate-900">Excellent Work!</h3>
                  <p className="text-slate-500 text-sm">{analysis.overall_feedback}</p>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Semantic Match</p>
                  <p className="text-2xl font-bold text-slate-900">{analysis.similarity_score}%</p>
                </Card>
                <Card className="p-4 border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Keywords Found</p>
                  <p className="text-2xl font-bold text-slate-900">{analysis.keyword_matches.length}</p>
                </Card>
              </div>

              <Card className="border-slate-200">
                <h4 className="text-lg mb-4 flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle size={18} className="text-green-600" /> Matched Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyword_matches.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 font-medium">{kw}</span>
                  ))}
                </div>
              </Card>

              <Card className="border-slate-200">
                <h4 className="text-lg mb-4 flex items-center gap-2 font-bold text-slate-900">
                  <AlertTriangle size={18} className="text-amber-600" /> Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-100 font-medium">{kw}</span>
                  ))}
                </div>
              </Card>

              <Card className="border-slate-200">
                <h4 className="text-lg mb-4 font-bold text-slate-900">Key Improvements</h4>
                <ul className="space-y-3">
                  {analysis.improvements.map((imp, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-3">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
