import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@/interfaces/auth";
import { account, ID } from "@/lib/appwrite";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  // Función para verificar si el usuario ya está autenticado
  const checkUser = async () => {
    try {
      const userData = await account.get();
      setUser({
        id: userData.$id,
        email: userData.email,
        fullName: userData.name || userData.email.split("@")[0],
      });
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Creamos una sesión de email y contraseña
      const session = await account.createEmailPasswordSession(email, password);
      console.log("Sesión creada:", session);

      // Si la sesión se crea correctamente, obtenemos los datos del usuario
      const userData = await account.get();
      console.log("Datos del usuario:", userData);

      setUser({
        id: userData.$id,
        email: userData.email,
        fullName: userData.name || userData.email.split("@")[0],
      });
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    setLoading(true);
    try {
      // Crear el usuario con un ID único generado por Appwrite
      const user = await account.create(ID.unique(), email, password, fullName);
      console.log("User created:", user);

      // No iniciamos sesión automáticamente
      setUser(null);
    } catch (error) {
      console.error("Error en el registro:", error);
      throw new Error("Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
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
