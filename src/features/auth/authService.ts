import type { User } from "@/interfaces/auth";
import { account, ID } from "../../lib/appwrite";

// Servicio de autenticación para manejar el registro, inicio de sesión y obtención del usuario actual
export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await account.get();
      return {
        id: userData.$id,
        email: userData.email,
        fullName: userData.name || userData.email.split("@")[0],
      };
    } catch (error) {
      console.error("Error al obtener el usuario actual:", error);
      return null;
    }
  },

  // Método para verificar si el usuario está autenticado
  async login(email: string, password: string): Promise<User> {
    await account.createEmailPasswordSession(email, password);
    const userData = await account.get();
    return {
      id: userData.$id,
      email: userData.email,
      fullName: userData.name || userData.email.split("@")[0],
    };
  },

  // Método para registrar un nuevo usuario
  async register(
    email: string,
    password: string,
    fullName: string
  ): Promise<void> {
    await account.create(ID.unique(), email, password, fullName);
  },

  // Método para actualizar el perfil del usuario
  async logout(): Promise<void> {
    await account.deleteSession("current");
  },
};
