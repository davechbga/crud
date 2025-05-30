import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@/interfaces/auth";
import { account } from "@/lib/appwrite";
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
  logout: () => Promise<void>;
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

// Función para formatear los datos del usuario

// Proveedor de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar el estado de autenticación al cargar
  useEffect(() => {
    authService
      .getCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error("Error en login:", error);
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
      setUser(null);
    } catch (error) {
      console.error("Error en el registro:", error);
      throw new Error("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
