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
export const uploadFile = async (file: File) => {
  try {
    const response = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );

    const fileUrl = storage.getFileDownload(STORAGE_BUCKET_ID, response.$id);

    return {
      fileId: response.$id,
      fileUrl: fileUrl.toString(),
    };
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw error;
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
  } catch (error) {
    console.error("Error al eliminar el archivo:", error);
    throw error;
  }
};

// Funciones auxiliares para manejo de recursos
const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error("Error al obtener el usuario actual:", error);
    throw error;
  }
};

const createDocument = async (data: ResourceData & { createdAt: string; userId: string }) => {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      RESOURCES_COLLECTION_ID,
      ID.unique(),
      data
    );
  } catch (error) {
    console.error("Error al crear el documento:", error);
    throw error;
  }
};

const updateDocument = async (id: string, data: UpdateResourceData) => {
  try {
    // Eliminar valores undefined o null de los datos de actualización
    const updateData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined && value !== null
      )
    );

    return await databases.updateDocument(
      DATABASE_ID,
      RESOURCES_COLLECTION_ID,
      id,
      updateData
    );
  } catch (error) {
    console.error("Error al actualizar el documento:", error);
    throw error;
  }
};

const deleteDocument = async (id: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, RESOURCES_COLLECTION_ID, id);
  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    throw error;
  }
};

// Funciones principales para manejo de recursos
export const createResource = async (data: ResourceData) => {
  try {
    const currentUser = await getCurrentUser();
    const resourceData = {
      ...data,
      createdAt: new Date().toISOString(),
      userId: currentUser.$id,
    };
    return await createDocument(resourceData) as unknown as Resource;
  } catch (error) {
    console.error("Error al crear el recurso:", error);
    throw error;
  }
};

export const getResources = async () => {
  try {
    const currentUser = await getCurrentUser();
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
};

export const updateResource = async (id: string, data: UpdateResourceData) => {
  try {
    if (!id) {
      throw new Error("El ID del documento es requerido para actualizar");
    }
    return await updateDocument(id, data) as unknown as Resource;
  } catch (error) {
    console.error("Error al actualizar el recurso:", error);
    throw error;
  }
};

export const deleteResource = async (id: string) => {
  try {
    if (!id) {
      throw new Error("El ID del documento es requerido para eliminar");
    }
    await deleteDocument(id);
  } catch (error) {
    console.error("Error al eliminar el recurso:", error);
    throw error;
  }
};
