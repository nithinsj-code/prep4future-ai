import React from 'react';

export const TopBar: React.FC = () => {
  return (
    <header className="h-20 border-b border-border bg-white flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {/* Minimal header */}
      </div>

      <div className="flex items-center gap-4">
        {/* TopBar is now minimal as requested */}
      </div>
    </header>
  );
};
