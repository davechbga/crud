import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Button } from "../ui/button";

// Constantes
const CATEGORIES = [
  "Documentación",
  "Herramientas",
  "Tutoriales",
  "Referencias",
];

// Componente para los controles de búsqueda y filtrado
export const SearchControls = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  onAddNew,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  onAddNew: () => void;
}) => (
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div className="flex flex-col sm:flex-row gap-4 flex-1">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar recursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filtrar por categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {CATEGORIES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <Button onClick={onAddNew}>
      <Plus className="h-4 w-4 mr-2" />
      Nuevo Recurso
    </Button>
  </div>
);
