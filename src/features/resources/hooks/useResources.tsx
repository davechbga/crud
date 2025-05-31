import { useState, useEffect } from "react";

import type { Resource } from "@/interfaces/resources";
import { resourceService } from "../services/resourceService";

// Tipos
type ResourceData = Omit<Resource, "$id" | "createdAt"> & { file?: File };
type UpdateResourceData = Partial<Resource> & { file?: File };

// Constantes
const NO_FILE_ID = "no-file";

interface LoadingState {
  fetching: boolean;
  creating: boolean;
  updating: Record<string, boolean>;
  deleting: Record<string, boolean>;
}

// Hook para manejar los recursos
export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    fetching: true,
    creating: false,
    updating: {},
    deleting: {},
  });
  const [error, setError] = useState<string | null>(null);

  // Cargar los recursos al inicializar el hook
  useEffect(() => {
    fetchResources();
  }, []);

  // Función para obtener los recursos
  const fetchResources = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetching: true }));
      const data = await resourceService.getResources();
      setResources(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los recursos");
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, fetching: false }));
    }
  };

  // Función para manejar archivos
  const handleFile = async (file?: File, oldFileId?: string) => {
    try {
      // Primero intentamos eliminar el archivo antiguo si existe
      if (oldFileId && oldFileId !== NO_FILE_ID) {
        try {
          await resourceService.deleteFile(oldFileId);
        } catch (err) {
          console.warn("Error al eliminar el archivo antiguo:", err);
        }
      }

      // Si no hay archivo nuevo, retornamos el ID especial
      if (!file) {
        return { fileId: NO_FILE_ID, fileUrl: "" };
      }

      // Subimos el nuevo archivo
      return await resourceService.uploadFile(file);
    } catch (err) {
      console.error("Error al manejar el archivo:", err);
      throw err;
    }
  };

  // Función para agregar un nuevo recurso
  const addResource = async (data: ResourceData) => {
    try {
      setLoading((prev) => ({ ...prev, creating: true }));
      const { file, ...resourceData } = data;
      const fileData = await handleFile(file);
      const newResource = await resourceService.createResource({
        ...resourceData,
        ...fileData,
      });
      setResources((prev) => [newResource, ...prev]);
      setError(null);
    } catch (err) {
      setError("Error al crear el recurso");
      console.error(err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, creating: false }));
    }
  };

  // Función para actualizar un recurso
  const updateResourceById = async (id: string, data: UpdateResourceData) => {
    try {
      setLoading((prev) => ({
        ...prev,
        updating: { ...prev.updating, [id]: true },
      }));

      if (!id) throw new Error("ID requerido");

      const { file, ...resourceData } = data;
      const resource = resources.find((r) => r.$id === id);
      
      // Manejar el archivo
      let fileData = {};
      if (file) {
        // Si hay un nuevo archivo, eliminar el antiguo y subir el nuevo
        fileData = await handleFile(file, resource?.fileId);
      } else if (resource?.fileId && resource.fileId !== NO_FILE_ID) {
        // Si no hay archivo nuevo pero había uno antiguo, eliminarlo
        await handleFile(undefined, resource.fileId);
        fileData = { fileId: NO_FILE_ID, fileUrl: "" };
      }

      // Preparar los datos de actualización
      const updateData = {
        ...resourceData,
        ...fileData,
        // Asegurarnos de mantener la categoría si no se cambió
        category: resourceData.category || resource?.category,
      };

      const updatedResource = await resourceService.updateResource(
        id,
        updateData
      );
      setResources((prev) =>
        prev.map((r) => (r.$id === id ? { ...r, ...updatedResource } : r))
      );
      setError(null);
    } catch (err) {
      setError("Error al actualizar el recurso");
      console.error(err);
      throw err;
    } finally {
      setLoading((prev) => ({
        ...prev,
        updating: { ...prev.updating, [id]: false },
      }));
    }
  };

  // Función para eliminar un recurso
  const deleteResourceById = async (id: string) => {
    try {
      setLoading((prev) => ({
        ...prev,
        deleting: { ...prev.deleting, [id]: true },
      }));

      if (!id) throw new Error("ID requerido");

      const resource = resources.find((r) => r.$id === id);
      
      // Eliminar el archivo asociado si existe
      if (resource?.fileId && resource.fileId !== NO_FILE_ID) {
        try {
          await resourceService.deleteFile(resource.fileId);
        } catch (err) {
          console.warn("Error al eliminar el archivo:", err);
        }
      }

      // Eliminar el recurso de la base de datos
      await resourceService.deleteResource(id);
      setResources((prev) => prev.filter((r) => r.$id !== id));
      setError(null);
    } catch (err) {
      setError("Error al eliminar el recurso");
      console.error(err);
      throw err;
    } finally {
      setLoading((prev) => ({
        ...prev,
        deleting: { ...prev.deleting, [id]: false },
      }));
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
