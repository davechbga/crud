import { useState, useEffect } from "react";
import { authService } from "./authService";
import type { User } from "@/interfaces/auth";

// Hook para manejar la autenticación del usuario
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  // Verifica si hay un usuario autenticado al cargar el hook
  const checkUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Métodos para manejar el inicio de sesión, registro y cierre de sesión
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw new Error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Método para registrar un nuevo usuario
  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    setLoading(true);
    try {
      await authService.register(email, password, fullName);
      setUser(null);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      throw new Error("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return {
    user,
    login,
    register,
    logout,
    loading,
  };
};
