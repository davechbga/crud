import { useState, useEffect } from "react";
import {
  createResource,
  getResources,
  updateResource,
  deleteResource,
  uploadFile,
  deleteFile
} from "../../lib/appwrite";
import type { Resource } from "@/interfaces/resources";


// Hook para manejar los recursos
export const useResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los recursos al inicializar el hook
  useEffect(() => {
    fetchResources();
  }, []);

  // Función para obtener los recursos al cargar el hook
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

  // Función para agregar un nuevo recurso
  const addResource = async (resourceData: Omit<Resource, "$id" | "createdAt"> & { file?: File }) => {
    try {
      setLoading(true);
      
      // Extraer el archivo de resourceData para evitar enviarlo a la base de datos
      const { file, ...resourceDataWithoutFile } = resourceData;
      
      // Si hay un archivo, subirlo primero
      let fileData = {};
      if (file) {
        const { fileId, fileUrl } = await uploadFile(file);
        fileData = { fileId, fileUrl };
      }

      // Crear el recurso con los datos del archivo
      const newResource = await createResource({
        ...resourceDataWithoutFile,
        ...fileData
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

  // Función para actualizar un recurso por ID
  const updateResourceById = async (id: string, resourceData: Partial<Resource> & { file?: File }) => {
    try {
      setLoading(true);
      if (!id) {
        throw new Error("Se requiere el ID del recurso para actualizar");
      }

      // Extraer el archivo de resourceData para evitar enviarlo a la base de datos
      const { file, ...resourceDataWithoutFile } = resourceData;

      // Si hay un archivo nuevo, subirlo
      let fileData = {};
      if (file) {
        // Eliminar el archivo anterior si existe
        const resource = resources.find(r => r.$id === id);
        if (resource?.fileId) {
          await deleteFile(resource.fileId);
        }

        // Subir el nuevo archivo
        const { fileId, fileUrl } = await uploadFile(file);
        fileData = { fileId, fileUrl };
      }

      // Actualizar el recurso con los nuevos datos del archivo
      const updatedResource = await updateResource(id, {
        ...resourceDataWithoutFile,
        ...fileData
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


  // Función para eliminar un recurso por ID
  const deleteResourceById = async (id: string) => {
    try {
      setLoading(true);
      if (!id) {
        throw new Error("Se requiere el ID del recurso para eliminar");
      }

      // Eliminar el archivo si existe
      const resource = resources.find(r => r.$id === id);
      if (resource?.fileId) {
        await deleteFile(resource.fileId);
      }

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
