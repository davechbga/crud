import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthHeader } from "@/features/auth/components/Header";
import { toast } from "sonner";
import type { RegisterData } from "@/interfaces/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [registerData, setRegisterData] = React.useState<RegisterData>({
    email: "",
    password: "",
    fullName: "",
  });

  const handleRegisterChange = (field: keyof RegisterData, value: string) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(
        registerData.email,
        registerData.password,
        registerData.fullName
      );
      toast.success("¡Registro exitoso!", {
        description: "Por favor, verifica tu correo electrónico para continuar.",
      });
      // Redirect to verification pending page
      navigate("/verify-email");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error de registro:", error);
      
      // Determinar el mensaje de error apropiado
      let errorMessage = "No se pudo crear la cuenta. Por favor, intenta de nuevo.";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 409) {
        errorMessage = "Ya existe una cuenta con este correo electrónico.";
      }

      // Mostrar el error con un estilo más visible
      toast.error("Error de registro", {
        description: errorMessage,
        duration: 5000, // Mostrar por 5 segundos
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #ef4444',
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Crear Cuenta</CardTitle>
            <CardDescription>
              Regístrate para comenzar a usar el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm
              data={registerData}
              onChange={handleRegisterChange}
              onSubmit={handleRegister}
              loading={loading}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage; 