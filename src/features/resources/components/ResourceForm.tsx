import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import type { Resource } from "@/interfaces/resources";
import { useAuth } from "../../auth/hooks/useAuth";
import { TitleField } from "./TitleField";
import { DescriptionField } from "./DescriptionField";
import { CategoryField } from "./CategoryField";
import { AttachmentField } from "./AttachField";

// Constantes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPE = "application/pdf";

interface ResourceFormProps {
  resource?: Resource | null;
  onSubmit: (
    data: Omit<Resource, "$id" | "createdAt"> & { file?: File }
  ) => void;
  onCancel: () => void;
  categories: string[];
}

const ResourceForm: React.FC<ResourceFormProps> = ({
  resource,
  onSubmit,
  onCancel,
  categories,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    linkUrl: "",
    fileUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<"link" | "file">("link");

  // Cargar datos del recurso si se está editando
  useEffect(() => {
    if (resource) {
      setFormData({
        title: resource.title,
        description: resource.description,
        category: resource.category,
        linkUrl: resource.linkUrl || "",
        fileUrl: resource.fileUrl || "",
      });
      setAttachmentType(resource.linkUrl ? "link" : "file");
    }
  }, [resource]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Manejar el cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar el tipo de archivo
      if (file.type !== ALLOWED_FILE_TYPE) {
        toast.error("Error", {
          description: "Solo se permiten archivos PDF.",
        });
        return;
      }

      // Validar el tamaño del archivo
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Error", {
          description: "El archivo no debe superar los 5MB.",
        });
        return;
      }

      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        fileUrl: file.name,
      }));
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category ||
      !user?.$id
    ) {
      toast.error("Error de validación", {
        description: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }

    // Preparar los datos según el tipo de adjunto
    const submitData: Omit<Resource, "$id" | "createdAt"> & { file?: File } = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      userId: user.$id,
      ...(attachmentType === "link" && formData.linkUrl
        ? { linkUrl: formData.linkUrl.trim() }
        : { linkUrl: undefined }),
      ...(attachmentType === "file" && selectedFile
        ? { file: selectedFile }
        : {}),
    };

    // Si estamos editando un recurso existente, asegurarse de que tengamos el ID
    if (resource && !resource.$id) {
      toast.error("Error", {
        description: "No se pudo identificar el recurso a actualizar.",
      });
      return;
    }

    onSubmit(submitData);

    toast.success(resource ? "Recurso actualizado" : "Recurso creado", {
      description: resource
        ? "El recurso ha sido actualizado correctamente."
        : "El nuevo recurso ha sido agregado correctamente.",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {resource ? "Editar Recurso" : "Nuevo Recurso"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TitleField
            value={formData.title}
            onChange={(value) => handleInputChange("title", value)}
          />

          <DescriptionField
            value={formData.description}
            onChange={(value) => handleInputChange("description", value)}
          />

          <CategoryField
            value={formData.category}
            onChange={(value) => handleInputChange("category", value)}
            categories={categories}
          />

          <AttachmentField
            attachmentType={attachmentType}
            setAttachmentType={setAttachmentType}
            linkUrl={formData.linkUrl}
            onLinkChange={(value) => handleInputChange("linkUrl", value)}
            onFileChange={handleFileChange}
            fileUrl={formData.fileUrl}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">{resource ? "Actualizar" : "Crear"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceForm;
