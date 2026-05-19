import React from 'react';
import { Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  return (
    <header className="h-20 border-b border-border bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 md:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Brand logo only shown on mobile screen */}
        <div className="flex items-center gap-2 md:hidden">
          <img
            src="/logo.svg"
            alt="Prep4Future logo"
            className="w-8 h-8 shrink-0"
          />
          <span className="font-bold text-lg text-slate-900 tracking-tight">Prep4Future</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* TopBar is now minimal as requested */}
      </div>
    </header>
  );
};
