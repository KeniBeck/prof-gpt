import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ¡Bienvenido, {user?.displayName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Asistente inteligente para profesores
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <p>Email: {user?.email}</p>
                <p>Rol: {user?.isTeacher ? 'Profesor' : 'Estudiante'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Panel de Control
          </h2>
          <p className="text-gray-600">
            Aquí podrás acceder a todas las funcionalidades de Mentora AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;