import type { User } from "@/interfaces/auth";
import { account, ID } from "@/lib/appwrite";
import { handleAuthError } from "@/lib/utils";

// Servicio de autenticación para manejar el registro, inicio de sesión y obtención del usuario actual
export const authService = {
  // Obtener el usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      const session = await account.getSession("current");
      if (!session) return null;
      const userData = await account.get();
      return {
        $id: userData.$id,
        email: userData.email,
        fullName: userData.name, // Appwrite usa 'name' para el nombre completo
      };
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
      return {
        $id: userData.$id,
        email: userData.email,
        fullName: userData.name,
      };
    } catch (error) {
      handleAuthError(error, "inicio de sesión");
      throw error;
    }
  },

  // Registrar un nuevo usuario
  async register(
    email: string,
    password: string,
    fullName: string
  ): Promise<void> {
    try {
      // Crear cuenta
      await account.create(ID.unique(), email, password, fullName);

      // Iniciar sesión automáticamente después del registroAdd commentMore actions
      await account.createEmailPasswordSession(email, password);

      // Enviar email de verificación
      await account.createVerification(
        `${window.location.origin}/verify-email`
      );
    } catch (error) {
      console.error("Error en el registro:", error);
      handleAuthError(error, "registro");
    }
  },

  // Verificar email
  async verifyEmail(userId: string, secret: string): Promise<void> {
    try {
      // Verificar el email del usuario
      await account.updateVerification(userId, secret);
    } catch (error) {
      handleAuthError(error, "verificación de email");
    }
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      // Eliminar la sesión actual
      await account.deleteSession("current");
    } catch (error) {
      handleAuthError(error, "cierre de sesión");
    }
  },
};
