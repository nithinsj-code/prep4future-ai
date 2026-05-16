import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, Mic2, MessageSquare, BarChart3, BookOpen, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppContext } from '../../context/AppContext';

const navItems = [
  { path: '/', label: 'Overview', icon: BookOpen },
  { path: '/resume', label: 'Resume Analyzer', icon: FileText },
  { path: '/interview', label: 'Mock Interview', icon: Mic2 },
  { path: '/coach', label: 'Career Coach', icon: MessageSquare },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { clearState } = useAppContext();

  const handleResetSession = () => {
    const confirmed = window.confirm("Clear all resume, interview, coach, and report data?");
    if (!confirmed) return;

    clearState();
    navigate('/resume');
  };

  return (
    <aside className="w-64 h-screen border-r border-border bg-white flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-12">
        <img
          src="/logo.svg"
          alt="Prep4Future logo"
          className="w-10 h-10 shrink-0"
        />
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Prep4Future</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
              isActive ? "bg-primary/5 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={clsx("transition-transform group-hover:scale-110", isActive && "text-primary")} />
                <span className="font-semibold">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleResetSession}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
      >
        <RotateCcw size={20} className="transition-transform group-hover:rotate-[-20deg]" />
        <span className="font-semibold">Fresh Session</span>
      </button>
    </aside>
  );
};
