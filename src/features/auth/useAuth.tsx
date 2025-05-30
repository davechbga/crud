import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@/interfaces/auth";
import { account, ID } from "@/lib/appwrite";

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
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

// Función para formatear los datos del usuario
const formatUserData = (userData: any): User => ({
  id: userData.$id,
  email: userData.email,
  fullName: userData.name || userData.email.split("@")[0],
});

// Proveedor de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar el estado de autenticación al cargar
  useEffect(() => {
    checkUser();
  }, []);

  // Verificar si el usuario está autenticado
  const checkUser = async () => {
    try {
      const userData = await account.get();
      setUser(formatUserData(userData));
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const session = await account.createEmailPasswordSession(email, password);
      console.log("Sesión creada:", session);

      const userData = await account.get();
      console.log("Datos del usuario:", userData);

      setUser(formatUserData(userData));
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
      const user = await account.create(ID.unique(), email, password, fullName);
      console.log("Usuario creado:", user);

      // No iniciamos sesión automáticamente
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
