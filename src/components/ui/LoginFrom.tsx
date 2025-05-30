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
        // Manejar errores específicos
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
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-amber-100/20 backdrop-blur-sm border border-gray-200 shadow-lg px-6 py-6 max-w-lg w-[95%] rounded-2xl mx-2"
      >
        <div className="">
          <div className="text-2xl font-bold text-gray-900">Iniciar Sesión</div>
          <div className="text-gray-700 mb-6">
            Accede a tu asistente educativo personalizado
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="space-y-6">
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
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg mb-2 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verificando...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
export default LoginFrom;