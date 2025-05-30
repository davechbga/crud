import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { AuthHeader } from "./Header";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import type { LoginData, RegisterData } from "@/interfaces/auth";

// Componente principal del formulario de autenticación
const AuthForm = () => {
  const { login, register, loading } = useAuth();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    password: "",
    fullName: "",
  });

  // Manejar cambios en los campos del formulario de inicio de sesión
  const handleLoginChange = (field: keyof LoginData, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  // Manejar cambios en los campos del formulario de registro
  const handleRegisterChange = (field: keyof RegisterData, value: string) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  // Manejar el inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      toast.success("¡Bienvenido!", {
        description: "Has iniciado sesión correctamente.",
      });
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      toast.error("Error de inicio de sesión", {
        description: "Por favor, verifica tus credenciales.",
      });
    }
  };

  // Manejar el registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(
        registerData.email,
        registerData.password,
        registerData.fullName
      );
      toast.success("¡Registro exitoso!", {
        description: "Tu cuenta ha sido creada. Por favor, inicia sesión.",
      });
      // Limpiar el formulario de registro
      setRegisterData({
        email: "",
        password: "",
        fullName: "",
      });
    } catch (error) {
      console.error("Error de registro:", error);
      toast.error("Error de registro", {
        description: "No se pudo crear la cuenta. Por favor, intenta de nuevo.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AuthHeader />

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Acceso al Sistema</CardTitle>
            <CardDescription>
              Inicia sesión o crea una nueva cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm
                  data={loginData}
                  onChange={handleLoginChange}
                  onSubmit={handleLogin}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="register">
                <RegisterForm
                  data={registerData}
                  onChange={handleRegisterChange}
                  onSubmit={handleRegister}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
