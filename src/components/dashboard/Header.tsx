import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

// Componente para el encabezado
interface HeaderUser {
  fullName?: string;
}

export const Header = ({
  user,
  onLogout,
}: {
  user: HeaderUser;
  onLogout: () => void;
}) => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <h1 className="text-xl font-semibold text-gray-900">
          Gestión de Recursos Técnicos
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Bienvenido, <span className="font-medium">{user.fullName}</span>
          </span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  </header>
);
