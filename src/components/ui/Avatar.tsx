import type { ReactNode } from 'react';

interface AvatarProps {
  children: ReactNode;
  className?: string;
}

export const Avatar = ({ children, className = '' }: AvatarProps) => {
  return (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  );
};

interface AvatarFallbackProps {
  children: ReactNode;
  className?: string;
}

export const AvatarFallback = ({ children, className = '' }: AvatarFallbackProps) => {
  return (
    <div className={`flex h-full w-full items-center justify-center rounded-full ${className}`}>
      {children}
    </div>
  );
};