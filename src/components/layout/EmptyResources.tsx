import { FileText, Plus } from "lucide-react";
import { Button } from "../ui/button";

// Componente para el mensaje de recursos vacíos
export const EmptyResources = ({
  searchTerm,
  categoryFilter,
  onAddNew,
}: {
  searchTerm: string;
  categoryFilter: string;
  onAddNew: () => void;
}) => (
  <div className="text-center py-12">
    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      No se encontraron recursos
    </h3>
    <p className="text-gray-600 mb-4">
      {searchTerm || categoryFilter !== "all"
        ? "Intenta ajustar los filtros de búsqueda."
        : "Comienza agregando tu primer recurso técnico."}
    </p>
    {!searchTerm && categoryFilter === "all" && (
      <Button onClick={onAddNew}>
        <Plus className="h-4 w-4 mr-2" />
        Agregar Primer Recurso
      </Button>
    )}
  </div>
);
