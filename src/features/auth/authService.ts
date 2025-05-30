import type { User } from "@/interfaces/auth";
import { account, ID } from "../../lib/appwrite";

// Tipos
interface UserData {
  $id: string;
  email: string;
  name?: string;
}

// Funciones auxiliares
const formatUserData = (userData: UserData): User => ({
  id: userData.$id,
  email: userData.email,
  fullName: userData.name || userData.email.split("@")[0],
});

const handleAuthError = (error: unknown, operation: string): never => {
  console.error(`Error en ${operation}:`, error);
  throw error;
};

// Servicio de autenticación para manejar el registro, inicio de sesión y obtención del usuario actual
export const authService = {
  // Obtener el usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await account.get();
      return formatUserData(userData);
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
      return null;
    }
  },

  // Iniciar sesión
  async login(email: string, password: string): Promise<User> {
    try {
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      return formatUserData(userData);
    } catch (error) {
      return handleAuthError(error, "inicio de sesión");
    }
  },

  // Registrar un nuevo usuario
  async register(
    email: string,
    password: string,
    fullName: string
  ): Promise<void> {
    try {
      await account.create(ID.unique(), email, password, fullName);
    } catch (error) {
      handleAuthError(error, "registro");
    }
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await account.deleteSession("current");
    } catch (error) {
      handleAuthError(error, "cierre de sesión");
    }
  },
};
