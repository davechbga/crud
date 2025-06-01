/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import type {
  AuthContextType,
  AuthProviderProps,
  User,
} from "@/interfaces/auth";
import { authService } from "../services/authService";

// Contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para acceder al contexto de autenticación
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe ser usado dentro de AuthProvider");
  return ctx;
};

// Proveedor de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para verificar la sesión del usuario
  const checkSession = async () => {
    try {
      setUser(await authService.getCurrentUser());
    } catch {
      console.error("Error al verificar la sesión");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Verificar la sesión al montar el componente
  useEffect(() => {
    checkSession();
  }, []);

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.login(email, password);
      await checkSession();
    } catch (e) {
      console.error("Error en el inicio de sesión:", e);
      setUser(null);
      throw new Error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Registrar un nuevo usuario
  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    setLoading(true);
    try {
      await authService.register(email, password, fullName);
      await checkSession();
    } catch (error) {
      console.error("Error en el registro:", error);
      setUser(null);
      throw new Error("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Verificar email
  const verifyEmail = async (userId: string, secret: string) => {
    setLoading(true);
    try {
      await authService.verifyEmail(userId, secret);
      await checkSession();
    } catch (error) {
      console.error("Error en la verificación:", error);
      throw new Error("Error al verificar el email");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    verifyEmail,
    logout,
    loading,
  };

  // Proveer el contexto de autenticación
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
