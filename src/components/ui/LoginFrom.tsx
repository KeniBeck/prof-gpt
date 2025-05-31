import { FloatingInput } from "./FloatingInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdMarkEmailUnread } from "react-icons/md";
import { AuthService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }).min(1, {
    message: "El email es requerido.",
  })
});

const LoginFrom = () => {
  const authService = new AuthService();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage("");
    
    console.log("Form submitted with values:", values);
    
    try {
      const response = await authService.validateTeacher(values.email);
      
      if (response.success && response.user) {
        console.log("User validated successfully", response.user);
        login(response.user);
        navigate("/home");
      } else {
        setErrorMessage(response.message || "Error al validar usuario");
        console.error("Validation failed:", response);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("Error inesperado. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="bg-amber-100/20 backdrop-blur-sm border border-gray-200 shadow-lg 
                 px-4 sm:px-6 py-6 sm:py-8 w-full max-w-lg rounded-2xl 
                 mx-auto flex-shrink-0"
    >
      <div className="space-y-4">
        <div className="text-xl sm:text-2xl font-bold text-gray-900">Iniciar Sesión</div>
        <div className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
          Accede a tu asistente educativo personalizado
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          <FloatingInput
            id="email"
            label="Correo Electrónico"
            type="email"
            registration={form.register("email")}
            error={form.formState.errors.email}
            required
            className="mt-4"
            icon={<MdMarkEmailUnread className="h-5 w-5 text-gray-500" />}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 
                       disabled:cursor-not-allowed text-white font-medium 
                       py-3 sm:py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                Verificando...
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginFrom;