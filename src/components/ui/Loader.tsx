import React from 'react';
import mentoraLogo from '../../assets/mentora.svg';
import '../../assets/utils.css';

interface LoaderProps {
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  showLogo?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  message = "Cargando...",
  subMessage = "Por favor espere",
  size = 'md',
  fullScreen = true,
  showLogo = true,
}) => {
  // Definir tamaños para diferentes configuraciones
  const sizes = {
    sm: {
      logo: 'w-12 h-12 sm:w-16 sm:h-16',
      spinner: 'border-2',
      text: 'text-sm sm:text-base',
      subtext: 'text-xs',
      bar: 'w-32 sm:w-40 h-1',
    },
    md: {
      logo: 'w-20 h-20 sm:w-24 sm:h-24',
      spinner: 'border-4',
      text: 'text-xl sm:text-2xl',
      subtext: 'text-sm',
      bar: 'w-48 sm:w-64 h-1.5',
    },
    lg: {
      logo: 'w-28 h-28 sm:w-32 sm:h-32',
      spinner: 'border-4',
      text: 'text-2xl sm:text-3xl',
      subtext: 'text-base',
      bar: 'w-64 sm:w-80 h-2',
    },
  };

  const containerClass = fullScreen 
    ? "h-screen w-full flex flex-col items-center justify-center" 
    : "w-full flex flex-col items-center justify-center py-10";

  return (
    <div className={`${containerClass} bg-gradient-to-br from-amber-50/50 to-red-50/20`}>
      <div className="text-center flex flex-col items-center">
        {showLogo && (
          <div className="relative mb-6">
            {/* Logo de Mentora */}
            <img 
              src={mentoraLogo} 
              alt="Mentora Logo" 
              className={`${sizes[size].logo} object-contain drop-shadow-md`}
            />
            
            {/* Spinner animado que rodea el logo */}
            <div className={`absolute inset-0 w-full h-full ${sizes[size].spinner} border-transparent border-t-red-600 rounded-full animate-spin`}></div>
          </div>
        )}
        
        {showLogo && <h2 className={`${sizes[size].text} font-semibold text-gray-800 mb-2`}>Mentora</h2>}
        <p className={`text-gray-600 mb-2 ${showLogo ? '' : 'mt-4'}`}>{message}</p>
        
        {/* Barra de progreso animada */}
        <div className={`${sizes[size].bar} mt-4 bg-gray-200 rounded-full overflow-hidden`}>
          <div className="h-full bg-gradient-to-r from-red-500 to-amber-400 loading-bar"></div>
        </div>
        
        <p className={`mt-4 ${sizes[size].subtext} text-gray-500`}>{subMessage}</p>
      </div>
    </div>
  );
};

export default Loader;
