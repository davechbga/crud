import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Upload, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Resource } from "@/interfaces/resources";
import { useAuth } from "../../auth/hooks/useAuth";
import { TitleField } from "./TitleField";
import { DescriptionField } from "./DescriptionField";
import { CategoryField } from "./CategoryField";

// Constantes
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPE = "application/pdf";
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE / (1024 * 1024);

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
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isFileDeleted, setIsFileDeleted] = useState(false);

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
      setIsFileDeleted(false);
    }
  }, [resource]);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Validar archivo
  const validateFile = (file: File): boolean => {
    setFileError(null);

    if (file.type !== ALLOWED_FILE_TYPE) {
      setFileError("Solo se permiten archivos PDF.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(`El archivo no debe superar los ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }

    return true;
  };

  // Manejar el cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        fileUrl: file.name,
      }));
    }
  };

  // Manejar el arrastre de archivos
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        fileUrl: file.name,
      }));
    }
  };

  // Eliminar archivo
  const handleRemoveFile = (e?: React.MouseEvent) => {
    // Prevenir la propagación del evento si existe
    e?.stopPropagation();
    
    // Limpiar el archivo seleccionado
    setSelectedFile(null);
    setFormData((prev) => ({
      ...prev,
      fileUrl: "",
    }));
    setFileError(null);
    setIsFileDeleted(true);

    // Limpiar el input file
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
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

    // Preparar los datos
    const submitData: Omit<Resource, "$id" | "createdAt"> & { file?: File } = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      userId: user.$id,
      linkUrl: formData.linkUrl.trim() || undefined,
      ...(selectedFile ? { file: selectedFile } : {}),
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

          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Enlace Web (opcional)</Label>
              <Input
                id="linkUrl"
                type="url"
                value={formData.linkUrl}
                onChange={(e) => handleInputChange("linkUrl", e.target.value)}
                placeholder="https://ejemplo.com/recurso"
                aria-label="Enlace web del recurso"
              />
            </div>

            <div className="space-y-4">
              <Label>Archivo PDF (opcional)</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onClick={() => document.getElementById("fileInput")?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    document.getElementById("fileInput")?.click();
                  }
                }}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Seleccionar archivo PDF"
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center space-x-2">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="ml-2"
                      aria-label="Eliminar archivo"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : resource?.fileUrl && !isFileDeleted ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-6 w-6 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Archivo actual: {resource.fileUrl.split("/").pop()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(resource.fileUrl, "_blank");
                        }}
                        aria-label="Ver archivo actual"
                      >
                        Ver archivo
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveFile}
                        aria-label="Eliminar archivo actual"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <p>Arrastra y suelta un archivo PDF aquí</p>
                      <p>o haz clic para seleccionar</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Máximo {MAX_FILE_SIZE_MB}MB
                    </p>
                  </div>
                )}
              </div>
              {fileError && (
                <div className="flex items-center space-x-2 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          </div>

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
