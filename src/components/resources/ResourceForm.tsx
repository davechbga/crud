import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { Resource } from "@/hooks/useResources";

interface ResourceFormProps {
  resource?: Resource | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  categories: string[];
}

const ResourceForm: React.FC<ResourceFormProps> = ({
  resource,
  onSubmit,
  onCancel,
  categories,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    linkUrl: "",
    fileUrl: "",
  });
  const [attachmentType, setAttachmentType] = useState<"link" | "file">("link");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.category
    ) {
      toast.error("Error de validación", {
        description: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }

    const submitData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      ...(attachmentType === "link"
        ? { linkUrl: formData.linkUrl }
        : { fileUrl: formData.fileUrl }),
    };

    onSubmit(submitData);

    toast(resource ? "Recurso actualizado" : "Recurso creado", {
      description: resource
        ? "El recurso ha sido actualizado correctamente."
        : "El nuevo recurso ha sido agregado correctamente.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Ej: Guía de React Hooks"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe brevemente el contenido del recurso..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Adjunto</Label>
            <Tabs
              value={attachmentType}
              onValueChange={(value) =>
                setAttachmentType(value as "link" | "file")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Enlace Web</TabsTrigger>
                <TabsTrigger value="file">Archivo PDF</TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="space-y-2">
                <Label htmlFor="linkUrl">URL del recurso</Label>
                <Input
                  id="linkUrl"
                  type="url"
                  value={formData.linkUrl}
                  onChange={(e) => handleInputChange("linkUrl", e.target.value)}
                  placeholder="https://ejemplo.com/recurso"
                />
              </TabsContent>

              <TabsContent value="file" className="space-y-2">
                <Label htmlFor="fileUrl">Archivo PDF</Label>
                <Input
                  id="fileUrl"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // In a real app, you would upload the file and get a URL
                      handleInputChange(
                        "fileUrl",
                        `mock-upload-url/${file.name}`
                      );
                    }
                  }}
                />
                {formData.fileUrl && (
                  <p className="text-sm text-gray-600">
                    Archivo: {formData.fileUrl.split("/").pop()}
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {resource ? "Actualizar" : "Crear"} Recurso
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceForm;
