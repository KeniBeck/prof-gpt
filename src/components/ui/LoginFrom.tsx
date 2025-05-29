import { FloatingInput } from "./FloatingInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdMarkEmailUnread } from "react-icons/md";
import { AuthService } from "../../services/authService";

const formSchema = z.object({
  email: z.string().min(2, {
    message: "Email is correct.",
  })
});
const LoginFrom = () => {
  const authService = new AuthService();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    await authService.validateTeacher(values.email);
    console.log("User validated successfully", authService);
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
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg mb-2"
            >
              Enviar
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
export default LoginFrom;
