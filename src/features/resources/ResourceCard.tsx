import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Calendar, Trash, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Resource } from "@/interfaces/resources";

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este recurso?')) {
      onDelete(resource.$id);
      toast("Recurso eliminado", {
        description: "El recurso ha sido eliminado correctamente.",
      });
    }
  };

  const handleOpenResource = () => {
    if (resource.linkUrl) {
      window.open(resource.linkUrl, "_blank");
    } else if (resource.fileUrl) {
      // Open PDF in a new tab
      const fileUrl = `${resource.fileUrl}&mode=admin`;
      window.open(fileUrl, "_blank");
      
      toast("Archivo abierto", {
        description: "El archivo se ha abierto en una nueva pestaña.",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Documentación: "bg-blue-100 text-blue-800",
      Herramientas: "bg-green-100 text-green-800",
      Tutoriales: "bg-purple-100 text-purple-800",
      Referencias: "bg-orange-100 text-orange-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium leading-6 mb-2">
            {resource.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white z-50">
              <DropdownMenuItem onClick={() => onEdit(resource)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenResource}
          className="w-full"
          disabled={!resource.linkUrl && !resource.fileUrl}
        >
          <FileText className="h-4 w-4 mr-2" />
          {resource.linkUrl ? "Abrir Enlace" : "Ver Archivo"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
