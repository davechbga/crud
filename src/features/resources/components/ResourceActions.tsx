import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Pencil, Trash } from "lucide-react";

// Componente para el menú de acciones
export const ResourceActions = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
        <Ellipsis className=" h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="bg-white z-50">
      <DropdownMenuItem onClick={onEdit}>
        <Pencil className="h-4 w-4 mr-2" />
        Editar
      </DropdownMenuItem>
      <DropdownMenuItem onClick={onDelete} className="text-red-600">
        <Trash className="h-4 w-4 mr-2 text-red-600" />
        Eliminar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
