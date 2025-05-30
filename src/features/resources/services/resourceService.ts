import { ID, Query } from "appwrite";
import type { Resource } from "@/interfaces/resources";
import {
  account,
  DATABASE_ID,
  databases,
  RESOURCES_COLLECTION_ID,
  storage,
  STORAGE_BUCKET_ID,
} from "@/lib/appwrite";

// Tipos
type ResourceData = Omit<Resource, "$id" | "createdAt">;
type UpdateResourceData = Partial<Resource>;

// Funciones auxiliares para manejo de archivos
export const resourceService = {
  async uploadFile(file: File) {
    try {
      const response = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
      return {
        fileId: response.$id,
        fileUrl: storage.getFileDownload(STORAGE_BUCKET_ID, response.$id).toString(),
      };
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      throw error;
    }
  },

  // Elimina un archivo del almacenamiento
  async deleteFile(fileId: string) {
    try {
      await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
      throw error;
    }
  },

  // Crea un recurso en la base de datos
  async createResource(data: ResourceData) {
    try {
      const currentUser = await account.get();
      const resourceData = {
        ...data,
        createdAt: new Date().toISOString(),
        userId: currentUser.$id,
      };
      return await databases.createDocument(
        DATABASE_ID,
        RESOURCES_COLLECTION_ID,
        ID.unique(),
        resourceData
      ) as unknown as Resource;
    } catch (error) {
      console.error("Error al crear el recurso:", error);
      throw error;
    }
  },

  // Obtiene todos los recursos del usuario actual
  async getResources() {
    try {
      const currentUser = await account.get();
      const response = await databases.listDocuments(
        DATABASE_ID,
        RESOURCES_COLLECTION_ID,
        [Query.orderDesc("createdAt"), Query.equal("userId", currentUser.$id)]
      );
      return response.documents as unknown as Resource[];
    } catch (error) {
      console.error("Error al obtener los recursos:", error);
      throw error;
    }
  },

  // Actualiza un recurso existente
  async updateResource(id: string, data: UpdateResourceData) {
    try {
      if (!id) throw new Error("ID requerido");
      const updateData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value != null)
      );
      return await databases.updateDocument(
        DATABASE_ID,
        RESOURCES_COLLECTION_ID,
        id,
        updateData
      ) as unknown as Resource;
    } catch (error) {
      console.error("Error al actualizar el recurso:", error);
      throw error;
    }
  },

  // Elimina un recurso y su archivo asociado
  async deleteResource(id: string) {
    try {
      if (!id) throw new Error("ID requerido");
      await databases.deleteDocument(DATABASE_ID, RESOURCES_COLLECTION_ID, id);
    } catch (error) {
      console.error("Error al eliminar el recurso:", error);
      throw error;
    }
  },
};
