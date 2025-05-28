import LoginFrom from "../components/ui/LoginFrom";

import MentoraSVG from "../assets/mentora.svg";
const Login = () => {
  return (
    <>
      <div className="h-screen w-full bg-gradient-to-br from-amber-50 to-red-50/30 flex flex-col items-center justify-center">
        <div className="text-center mb-2">
          <div className="flex justify-center">
            <img src={MentoraSVG} className="h-[150px] w-[150px]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Mentora AI</h1>
          <p className="text-gray-600 mt-4">
            Asistente inteligente para profesores
          </p>
        </div>
        <LoginFrom />
      </div>
    </>
  );
};
export default Login;
