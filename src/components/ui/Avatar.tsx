import type { ReactNode, CSSProperties } from 'react';

interface AvatarProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const Avatar = ({ children, className = '', style }: AvatarProps) => {
  return (
    <div 
      className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

interface AvatarImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}

export const AvatarImage = ({ src, alt = '', className = '', style }: AvatarImageProps) => {
  return (
    <img 
      src={src}
      alt={alt}
      className={`aspect-square h-full w-full object-cover ${className}`}
      style={style}
    />
  );
};

interface AvatarFallbackProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const AvatarFallback = ({ children, className = '', style }: AvatarFallbackProps) => {
  return (
    <div 
      className={`flex h-full w-full items-center justify-center rounded-full ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};