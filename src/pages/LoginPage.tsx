import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthHeader } from "@/features/auth/components/Header";
import { toast } from "sonner";
import type { LoginData } from "@/interfaces/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [loginData, setLoginData] = React.useState<LoginData>({
    email: "",
    password: "",
  });

  // Manejar cambios en los campos del formulario de inicio de sesión
  const handleLoginChange = (field: keyof LoginData, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  // Manejar el envío del formulario de inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Llamar al servicio de inicio de sesión con las credenciales
      await login(loginData.email, loginData.password);
      toast.success("¡Bienvenido!", {
        description: "Has iniciado sesión correctamente.",
      });
      navigate("/dashboard"); // Redirigir a la página de dashboard después del inicio de sesión
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast.error("Error de inicio de sesión", {
        description: "Por favor, verifica tus credenciales.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm
              data={loginData}
              onChange={handleLoginChange}
              onSubmit={handleLogin}
              loading={loading}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Regístrate aquí
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
