import { ID, Query } from "appwrite";
import type {
  Resource,
  ResourceData,
  UpdateResourceData,
} from "@/interfaces/resources";
import {
  account,
  DATABASE_ID,
  databases,
  RESOURCES_COLLECTION_ID,
  storage,
  STORAGE_BUCKET_ID,
} from "@/lib/appwrite";

// Tipos

// Constantes
const NO_FILE_ID = "no-file";

// Funciones auxiliares para manejo de archivos
export const resourceService = {
  // Sube un archivo al almacenamiento y devuelve su ID y URL
  async uploadFile(file: File) {
    if (!file) return { fileId: NO_FILE_ID, fileUrl: "" };
    const { $id } = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );
    return {
      fileId: $id,
      fileUrl: storage.getFileView(STORAGE_BUCKET_ID, $id).toString(),
    };
  },

  // Elimina un archivo del almacenamiento
  async deleteFile(fileId: string) {
    if (fileId && fileId !== NO_FILE_ID) {
      try {
        await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
      } catch (e) {
        console.error("Error al eliminar el archivo:", e);
        throw e;
      }
    }
  },

  // Crea un recurso en la base de datos
  async createResource(data: ResourceData) {
    try {
      const userId = (await account.get()).$id;
      const resourceData = {
        ...data,
        createdAt: new Date(),
        userId,
        fileId: data.fileId ?? NO_FILE_ID,
      };
      const res = await databases.createDocument(
        DATABASE_ID,
        RESOURCES_COLLECTION_ID,
        ID.unique(),
        resourceData
      );
      return {
        ...res,
        createdAt: new Date(res.createdAt),
      } as unknown as Resource;
    } catch (error) {
      console.error("Error al crear el recurso:", error);
      throw error;
    }
  },

  // Obtiene todos los recursos del usuario actual
  async getResources(): Promise<Resource[]> {
    try {
      const { $id: userId } = await account.get();
      const { documents } = await databases.listDocuments(
        DATABASE_ID,
        RESOURCES_COLLECTION_ID,
        [Query.orderDesc("createdAt"), Query.equal("userId", userId)]
      );
      return documents.map((doc) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
      })) as unknown as Resource[];
    } catch (error) {
      console.error("Error al obtener los recursos:", error);
      throw error;
    }
  },

  // Actualiza un recurso existente
  async updateResource(id: string, data: UpdateResourceData) {
    if (!id) throw new Error("ID requerido");
    const updateData = {
      ...Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined)
      ),
      fileId: data.fileId ?? NO_FILE_ID,
    };
    const res = await databases.updateDocument(
      DATABASE_ID,
      RESOURCES_COLLECTION_ID,
      id,
      updateData
    );
    return {
      ...res,
      createdAt: new Date(res.createdAt),
    } as unknown as Resource;
  },

  // Elimina un recurso
  async deleteResource(id: string) {
    if (!id) throw new Error("ID requerido");
    try {
      await databases.deleteDocument(DATABASE_ID, RESOURCES_COLLECTION_ID, id);
    } catch (error) {
      console.error("Error al eliminar el recurso:", error);
      throw error;
    }
  },
};
