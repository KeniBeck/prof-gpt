import type { ReactNode } from 'react';

interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
}

export const ScrollArea = ({ children, className = '' }: ScrollAreaProps) => {
  return (
    <div className={`overflow-auto ${className}`}>
      {children}
    </div>
  );
};