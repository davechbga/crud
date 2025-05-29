import type { Resource } from '@/interfaces/resources';
import { Client, Account, Databases, ID, Query, Storage } from 'appwrite';

// Configuración de Appwrite
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

// Inicializar servicios de Appwrite
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

// IDs de la base de datos y la colección
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE;
export const RESOURCES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION;
export const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET;

// Funciones auxiliares para subir archivos
export const uploadFile = async (file: File) => {
    try {
        const response = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file
        );
        
        // Obtener la URL del archivo usando getFileDownload en lugar de getFileView
        const fileUrl = storage.getFileDownload(
            STORAGE_BUCKET_ID,
            response.$id
        );
        
        return {
            fileId: response.$id,
            fileUrl: fileUrl.toString()
        };
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        throw error;
    }
};

export const deleteFile = async (fileId: string) => {
    try {
        await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
    } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        throw error;
    }
};

// Funciones auxiliares para recursos
export const createResource = async (data: Omit<Resource, '$id' | 'createdAt'>) => {
    try {
        // Obtener el usuario actual primero
        const currentUser = await account.get();

        // Asegurarse de que el usuario actual tenga un ID
        const response = await databases.createDocument(
            DATABASE_ID,
            RESOURCES_COLLECTION_ID,
            ID.unique(),
            {
                ...data,
                createdAt: new Date().toISOString(),
                userId: currentUser.$id // Usar el ID del usuario actual
            }
        );
        return response as unknown as Resource;
    } catch (error) {
        console.error('Error al crear el recurso:', error);
        throw error;
    }
};

// Funciones para manejar recursos
export const getResources = async () => {
    try {
        const currentUser = await account.get();
        const response = await databases.listDocuments(
            DATABASE_ID,
            RESOURCES_COLLECTION_ID,
            [
                Query.orderDesc('createdAt'),
                Query.equal('userId', currentUser.$id)
            ]
        );
        return response.documents as unknown as Resource[];
    } catch (error) {
        console.error('Error al obtener los recursos:', error);
        throw error;
    }
};

// Actualiza un recurso existente
export const updateResource = async (id: string, data: Partial<Resource>) => {
    try {
        if (!id) {
            throw new Error('El ID del documento es requerido para actualizar');
        }

        // Eliminar valores undefined o null de los datos de actualización
        const updateData = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value !== undefined && value !== null)
        );

        const response = await databases.updateDocument(
            DATABASE_ID,
            RESOURCES_COLLECTION_ID,
            id,
            updateData
        );
        return response as unknown as Resource;
    } catch (error) {
        console.error('Error al actualizar el recurso:', error);
        throw error;
    }
};

// Elimina un recurso por su ID
export const deleteResource = async (id: string) => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            RESOURCES_COLLECTION_ID,
            id
        );
    } catch (error) {
        console.error('Error al eliminar el recurso:', error);
        throw error;
    }
}; 