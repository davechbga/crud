import { useState } from "react";
import type { Resource } from "@/interfaces/resources";
import ResourceForm from "../../features/resources/components/ResourceForm";
import ResourceCard from "../../features/resources/components/ResourceCard";
import { useResources } from "@/features/resources/hooks/useResources";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Header } from "./Header";
import { StatsPanel } from "./StatsPanel";
import { SearchControls } from "./Filters";
import { EmptyResources } from "./EmptyResources";
import { Skeleton } from "@/components/ui/skeleton";

// Constantes
const CATEGORIES = [
  "Documentación",
  "Herramientas",
  "Tutoriales",
  "Referencias",
];

// Componente principal del Dashboard
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { resources, addResource, updateResource, deleteResource, loading } =
    useResources();
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filtrar recursos según búsqueda y categoría
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || resource.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleFormSubmit = (
    resourceData: Omit<Resource, "$id" | "createdAt"> & { file?: File }
  ) => {
    if (editingResource) {
      updateResource(editingResource.$id, resourceData);
    } else {
      addResource(resourceData);
    }
    setShowForm(false);
    setEditingResource(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Header user={user} onLogout={logout} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <StatsPanel resources={resources} />
        </div>

        <div className="mb-6">
          <SearchControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onAddNew={() => setShowForm(true)}
          />
        </div>

        {loading.fetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl border p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-20" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-3 w-3 mr-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.$id}
                resource={resource}
                onEdit={handleEdit}
                onDelete={deleteResource}
              />
            ))}
          </div>
        )}

        {!loading.fetching && filteredResources.length === 0 && (
          <EmptyResources
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            onAddNew={() => setShowForm(true)}
          />
        )}
      </div>

      {showForm && (
        <ResourceForm
          resource={editingResource}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
          categories={CATEGORIES}
        />
      )}
    </div>
  );
};

export default Dashboard;
