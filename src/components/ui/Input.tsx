import type { InputHTMLAttributes} from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2
          text-sm ring-offset-white placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';