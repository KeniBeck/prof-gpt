import { FloatingInput } from "./FloatingInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdMarkEmailUnread } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { AuthService } from "../../services/authService";
import type { LoginCredentials } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ButtonLoader from "./ButtonLoader";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }).min(1, {
    message: "El email es requerido.",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida."
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
      password: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage("");
    
    console.log("Form submitted with values:", { email: values.email, password: '***' });
    
    try {
      const credentials: LoginCredentials = {
        email: values.email,
        password: values.password
      };
      
      const response = await authService.validateTeacher(credentials);
      
      if (response.success && response.user) {
        console.log("Usuario autenticado correctamente", response.user);
        login(response.user);
        navigate("/home");
      } else {
        setErrorMessage(response.message || "Error al validar usuario");
        console.error("Falló la autenticación:", response);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
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
          Login con tu correo oficial
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
            className="mb-4"
            icon={<MdMarkEmailUnread className="h-5 w-5 text-gray-500" />}
          />
          
          <FloatingInput
            id="password"
            label="Contraseña"
            type="password"
            registration={form.register("password")}
            error={form.formState.errors.password}
            required
            className="mb-4"
            icon={<RiLockPasswordLine className="h-5 w-5 text-gray-500" />}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 
                       disabled:cursor-not-allowed text-white font-medium 
                       py-3 sm:py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
          >
            {isLoading ? (
              <ButtonLoader text="Verificando..." size="md" color="white" />
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