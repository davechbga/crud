import { useState, useEffect } from "react";

import type { Resource } from "@/interfaces/resources";
import { resourceService } from "../services/resourceService";

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
      const data = await resourceService.getResources();
      setResources(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los recursos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar archivos
  const handleFile = async (file?: File, oldFileId?: string) => {
    if (oldFileId) await resourceService.deleteFile(oldFileId);
    if (!file) return {};
    return await resourceService.uploadFile(file);
  };

  // Función para agregar un nuevo recurso
  const addResource = async (data: ResourceData) => {
    try {
      setLoading(true);
      const { file, ...resourceData } = data;
      const fileData = await handleFile(file);
      const newResource = await resourceService.createResource({ ...resourceData, ...fileData });
      setResources(prev => [newResource, ...prev]);
      setError(null);
    } catch (err) {
      setError("Error al crear el recurso");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar un recurso
  const updateResourceById = async (id: string, data: UpdateResourceData) => {
    try {
      setLoading(true);
      if (!id) throw new Error("ID requerido");
      
      const { file, ...resourceData } = data;
      const resource = resources.find(r => r.$id === id);
      const fileData = await handleFile(file, resource?.fileId);
      
      const updatedResource = await resourceService.updateResource(id, { ...resourceData, ...fileData });
      setResources(prev => prev.map(r => r.$id === id ? { ...r, ...updatedResource } : r));
      setError(null);
    } catch (err) {
      setError("Error al actualizar el recurso");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un recurso
  const deleteResourceById = async (id: string) => {
    try {
      setLoading(true);
      if (!id) throw new Error("ID requerido");
      
      const resource = resources.find(r => r.$id === id);
      await handleFile(undefined, resource?.fileId);
      await resourceService.deleteResource(id);
      setResources(prev => prev.filter(r => r.$id !== id));
      setError(null);
    } catch (err) {
      setError("Error al eliminar el recurso");
      console.error(err);
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
