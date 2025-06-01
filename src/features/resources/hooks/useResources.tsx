import { useState, useEffect } from "react";

import type { LoadingState, Resource } from "@/interfaces/resources";
import { resourceService } from "../services/resourceService";

// Tipos
type ResourceData = Omit<Resource, "$id" | "createdAt"> & { file?: File };
type UpdateResourceData = Partial<Resource> & { file?: File };

// Constantes
const NO_FILE_ID = "no-file";

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

  // Obtener recursos
  const fetchResources = async () => {
    setLoading((l) => ({ ...l, fetching: true }));
    try {
      setResources(await resourceService.getResources());
      setError(null);
    } catch {
      setError("Error al cargar los recursos");
    } finally {
      setLoading((l) => ({ ...l, fetching: false }));
    }
  };

  // Maneja archivos: elimina el antiguo y sube el nuevo si existe
  const handleFile = async (file?: File, oldFileId?: string) => {
    if (oldFileId && oldFileId !== NO_FILE_ID) {
      resourceService
        .deleteFile(oldFileId)
        .catch((err) =>
          console.warn("Error al eliminar archivo antiguo:", err)
        );
    }
    if (!file) return { fileId: NO_FILE_ID, fileUrl: "" };
    return resourceService.uploadFile(file);
  };

  // Agrega un nuevo recurso
  const addResource = async (data: ResourceData) => {
    setLoading((l) => ({ ...l, creating: true }));
    try {
      const { file, ...rest } = data;
      const fileData = await handleFile(file);
      const newResource = await resourceService.createResource({
        ...rest,
        ...fileData,
      });
      setResources((r) => [newResource, ...r]);
      setError(null);
    } catch {
      setError("Error al crear el recurso");
      throw new Error("Error al crear el recurso");
    } finally {
      setLoading((l) => ({ ...l, creating: false }));
    }
  };

  // Actualiza un recurso por ID
  const updateResourceById = async (id: string, data: UpdateResourceData) => {
    setLoading((l) => ({
      ...l,
      updating: { ...l.updating, [id]: true },
    }));
    try {
      if (!id) throw new Error("ID requerido");
      const { file, ...rest } = data;
      const resource = resources.find((r) => r.$id === id);
      let fileData = {};
      if (file) {
        fileData = await handleFile(file, resource?.fileId);
      } else if (resource?.fileId && resource.fileId !== NO_FILE_ID) {
        await handleFile(undefined, resource.fileId);
        fileData = { fileId: NO_FILE_ID, fileUrl: "" };
      }
      const updatedResource = await resourceService.updateResource(id, {
        ...rest,
        ...fileData,
        category: rest.category ?? resource?.category,
      });
      setResources((r) =>
        r.map((item) =>
          item.$id === id ? { ...item, ...updatedResource } : item
        )
      );
      setError(null);
    } catch {
      setError("Error al actualizar el recurso");
      throw new Error("Error al actualizar el recurso");
    } finally {
      setLoading((l) => ({
        ...l,
        updating: { ...l.updating, [id]: false },
      }));
    }
  };

  // Elimina un recurso por ID
  const deleteResourceById = async (id: string) => {
    setLoading((l) => ({ ...l, deleting: { ...l.deleting, [id]: true } }));
    try {
      if (!id) throw new Error("ID requerido");
      const resource = resources.find((r) => r.$id === id);
      if (resource?.fileId && resource.fileId !== NO_FILE_ID) {
        resourceService.deleteFile(resource.fileId).catch(console.warn);
      }
      await resourceService.deleteResource(id);
      setResources((r) => r.filter((res) => res.$id !== id));
      setError(null);
    } catch (err) {
      setError("Error al eliminar el recurso");
      throw err;
    } finally {
      setLoading((l) => ({ ...l, deleting: { ...l.deleting, [id]: false } }));
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
