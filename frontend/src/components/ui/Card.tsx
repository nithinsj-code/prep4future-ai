import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, glow, onClick }) => {
  return (
    <div className={cn("glass-card group", className)} onClick={onClick}>
      {glow && (
        <div className="glow w-[300px] h-[300px] bg-primary top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      )}
      {children}
    </div>
  );
};
