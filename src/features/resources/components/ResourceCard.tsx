import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Link } from "lucide-react";
import { toast } from "sonner";
import type { Resource } from "@/interfaces/resources";
import { formatDate } from "@/lib/utils";
import { ResourceActions } from "./ResourceActions";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

// Constantes
const CATEGORY_COLORS = {
  Documentación: "bg-blue-100 text-blue-800",
  Herramientas: "bg-green-100 text-green-800",
  Tutoriales: "bg-purple-100 text-purple-800",
  Referencias: "bg-orange-100 text-orange-800",
} as const;

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onEdit,
  onDelete,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Manejar la eliminación del recurso
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(resource.$id);
    setIsDeleteDialogOpen(false);
    toast("Recurso eliminado", {
      description: "El recurso ha sido eliminado correctamente.",
    });
  };

  // Obtener el color de la categoría
  const getCategoryColor = (category: string) => {
    return (
      CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-medium leading-6 mb-2">
              {resource.title}
            </CardTitle>
            <ResourceActions
              onEdit={() => onEdit(resource)}
              onDelete={handleDelete}
            />
          </div>
          <Badge className={`w-fit ${getCategoryColor(resource.category)}`}>
            {resource.category}
          </Badge>
        </CardHeader>

        <CardContent className="pb-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {resource.description}
          </p>

          <div className="flex items-center text-xs text-gray-500 mt-3">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(resource.createdAt)}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col pt-0 space-y-2">
          {resource.linkUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(resource.linkUrl, "_blank")}
              className="w-full"
            >
              <Link className="h-4 w-4 mr-2" />
              Abrir Enlace
            </Button>
          )}

          {resource.fileUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const fileUrl = resource.fileUrl;
                window.open(fileUrl, "_blank");
                toast("Archivo abierto", {});
              }}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Ver Archivo
            </Button>
          )}
        </CardFooter>
      </Card>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ResourceCard;
