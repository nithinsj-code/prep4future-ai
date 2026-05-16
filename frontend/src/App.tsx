import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { TopBar } from './components/Layout/TopBar';
import { AppProvider } from './context/AppContext';

// Lazy load pages
const Overview = React.lazy(() => import('./pages/Overview'));
const ResumeAnalyzer = React.lazy(() => import('./pages/ResumeAnalyzer'));
const MockInterview = React.lazy(() => import('./pages/MockInterview'));
const CareerCoach = React.lazy(() => import('./pages/CareerCoach'));
const Reports = React.lazy(() => import('./pages/Reports'));

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="flex-1 p-8 overflow-y-auto">
              <React.Suspense fallback={<div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
                <Routes>
                  <Route path="/" element={<Overview />} />
                  <Route path="/resume" element={<ResumeAnalyzer />} />
                  <Route path="/interview" element={<MockInterview />} />
                  <Route path="/coach" element={<CareerCoach />} />
                  <Route path="/reports" element={<Reports />} />
                </Routes>
              </React.Suspense>
            </main>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
