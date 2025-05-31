/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@/interfaces/auth";
import { authService } from "../services/authService";

// Tipos
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  verifyEmail: (userId: string, secret: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

// Proveedor de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para verificar la sesión actual
  const checkSession = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error al verificar la sesión:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Verificar el estado de autenticación al cargar y cuando cambia la sesión
  useEffect(() => {
    checkSession();

    // Verificar la sesión periódicamente
    const interval = setInterval(checkSession, 30000); // Verificar cada 30 segundos

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Llamar al servicio de autenticación para iniciar sesión
      const userData = await authService.login(email, password);
      // Actualizar el estado del usuario con los datos obtenidos
      setUser(userData);
      // Verificar la sesión para asegurar que los datos están actualizados
      await checkSession();
    } catch (error) {
      console.error("Error en login:", error);
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
      // Llamar al servicio de autenticación para registrar un nuevo usuario
      await authService.register(email, password, fullName);
      // Actualizar el estado del usuario después del registro
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
      // Llamar al servicio de autenticación para verificar el email
      await authService.verifyEmail(userId, secret);
      // Actualizar el estado del usuario después de la verificación
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
      // Llamar al servicio de autenticación para cerrar sesión
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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
