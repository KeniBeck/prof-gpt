import { FloatingInput } from "./FloatingInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MdMarkEmailUnread } from "react-icons/md";
import { TbPasswordFingerprint } from "react-icons/tb";

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Email is correct.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
});
const LoginFrom = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form submitted with values:", values);
    }
    return (
        <>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-[500px] bg-amber-50/90 backdrop-blur-sm border-gray-100 shadow-lg p-4">
                <div className="text-2xl font-bold text-gray-900">Iniciar Sesión</div>
                <div className="text-gray-700 mb-6">Accede a tu asistente educativo personalizado</div>

                <div className="space-y-6">
                    <FloatingInput
                        id="email"
                        label="Correo Electrónico"
                        type="email"
                        registration={form.register("email")}
                        error={form.formState.errors.password}
                        required
                        className="mt-4"
                        icon={<MdMarkEmailUnread className="h-5 w-5 text-gray-500" />} />
                    <FloatingInput
                        id="password"
                        label="Contraseña"
                        type="password"
                        registration={form.register("password")}
                        error={form.formState.errors.password}
                        required
                        className="mt-4"
                        icon={<TbPasswordFingerprint className="h-5 w-5 text-gray-500" />}
                    />
                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg mb-2"
                    >
                        Enviar
                    </button>
                </div>



            </form>
        </>
    );
}
export default LoginFrom;