import { useState, useEffect } from "react";

import type { Resource } from "@/interfaces/resources";
import {
  createResource,
  deleteFile,
  deleteResource,
  getResources,
  updateResource,
  uploadFile,
} from "./resourceService";

// Tipos
type ResourceData = Omit<Resource, "$id" | "createdAt"> & { file?: File };
type UpdateResourceData = Partial<Resource> & { file?: File };

// Hook para manejar los recursos
export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los recursos al inicializar el hook
  useEffect(() => {
    fetchResources();
  }, []);

  // Función para obtener los recursos
  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResources();
      setResources(data as Resource[]);
      setError(null);
    } catch (err) {
      setError("Error al cargar los recursos");
      console.error("Error al cargar los recursos", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar archivos
  const handleFileUpload = async (file: File | undefined) => {
    if (!file) return {};
    const { fileId, fileUrl } = await uploadFile(file);
    return { fileId, fileUrl };
  };

  // Función para manejar la eliminación de archivos
  const handleFileDeletion = async (fileId: string | undefined) => {
    if (fileId) {
      await deleteFile(fileId);
    }
  };

  // Función para agregar un nuevo recurso
  const addResource = async (resourceData: ResourceData) => {
    try {
      setLoading(true);

      // Extraer el archivo de resourceData
      const { file, ...resourceDataWithoutFile } = resourceData;

      // Subir archivo si existe
      const fileData = await handleFileUpload(file);

      // Crear el recurso
      const newResource = await createResource({
        ...resourceDataWithoutFile,
        ...fileData,
      });

      setResources((prev) => [newResource as Resource, ...prev]);
      setError(null);
    } catch (err) {
      setError("Error al crear el recurso");
      console.error("Error al crear el recurso", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un recurso
  const updateResourceById = async (id: string, resourceData: UpdateResourceData) => {
    try {
      setLoading(true);
      if (!id) {
        throw new Error("Se requiere el ID del recurso para actualizar");
      }

      // Extraer el archivo de resourceData
      const { file, ...resourceDataWithoutFile } = resourceData;

      // Manejar archivo si existe
      let fileData = {};
      if (file) {
        // Eliminar archivo anterior si existe
        const resource = resources.find((r) => r.$id === id);
        await handleFileDeletion(resource?.fileId);

        // Subir nuevo archivo
        fileData = await handleFileUpload(file);
      }

      // Actualizar el recurso
      const updatedResource = await updateResource(id, {
        ...resourceDataWithoutFile,
        ...fileData,
      });

      setResources((prev) =>
        prev.map((resource) =>
          resource.$id === id ? { ...resource, ...updatedResource } : resource
        )
      );
      setError(null);
    } catch (err) {
      setError("Error al actualizar el recurso");
      console.error("Error al actualizar el recurso", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un recurso
  const deleteResourceById = async (id: string) => {
    try {
      setLoading(true);
      if (!id) {
        throw new Error("Se requiere el ID del recurso para eliminar");
      }

      // Eliminar archivo si existe
      const resource = resources.find((r) => r.$id === id);
      await handleFileDeletion(resource?.fileId);

      // Eliminar el recurso
      await deleteResource(id);
      setResources((prev) => prev.filter((resource) => resource.$id !== id));
      setError(null);
    } catch (err) {
      setError("Error al eliminar el recurso");
      console.error("Error al eliminar el recurso", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    resources,
    loading,
    error,
    addResource,
    updateResource: updateResourceById,
    deleteResource: deleteResourceById,
    refreshResources: fetchResources,
  };
};
