import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Resource } from "@/interfaces/resources";
import { FileText } from "lucide-react";

// Componente para el panel de estadísticas
export const StatsPanel = ({ resources }: { resources: Resource[] }) => {
  const recentResources = resources.filter((r) => {
    const today = new Date();
    const resourceDate = new Date(r.createdAt);
    const diffTime = Math.abs(today.getTime() - resourceDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Panel de Control</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {resources.length}
            </div>
            <div className="text-sm text-gray-600">Total de Recursos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {new Set(resources.map((r) => r.category)).size}
            </div>
            <div className="text-sm text-gray-600">Categorías</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {recentResources.length}
            </div>
            <div className="text-sm text-gray-600">Recientes (7 días)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
