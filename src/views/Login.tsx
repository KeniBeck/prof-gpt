import LoginFrom from "../components/ui/LoginFrom";
import MentoraSVG from "../assets/mentora.svg";

const Login = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-50 to-red-50/30 flex flex-col items-center justify-center relative">
      {/* Contenedor principal con altura mínima dinámica */}
      <div className="w-full max-w-lg flex flex-col items-center justify-center min-h-[100dvh] sm:min-h-screen py-8">
        {/* Logo y título */}
        <div className="text-center mb-6 sm:mb-8 flex-shrink-0">
          <div className="flex justify-center">
            <img
              src={MentoraSVG}
              alt="Mentora Logo"
              className="h-24 w-24 sm:h-32 sm:w-32 md:h-[150px] md:w-[150px]"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            Mentora AI
          </h1>
          <p className="text-gray-600 mt-2 sm:mt-4 text-sm sm:text-base px-4">
            Mentora, ChatBot para Staff Ameritec
          </p>
        </div>

        {/* Formulario */}
        <div className="w-full px-4">
          <LoginFrom />
        </div>
      </div>
    </div>
  );
};

export default Login;
