import React from 'react';

interface ButtonLoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'red';
}

const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  text = "Cargando...",
  size = 'md',
  color = 'white'
}) => {
  // Definir tamaños para el spinner
  const sizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4 sm:h-5 sm:w-5',
    lg: 'h-5 w-5 sm:h-6 sm:w-6',
  };
  
  // Definir colores para el spinner
  const colors = {
    white: 'border-white',
    red: 'border-red-600',
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full ${sizes[size]} border-b-2 ${colors[color]} mr-2`}></div>
      {text}
    </div>
  );
};

export default ButtonLoader;
