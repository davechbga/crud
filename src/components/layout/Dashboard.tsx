import { useState } from "react";
import type { Resource } from "@/interfaces/resources";
import ResourceForm from "../../features/resources/components/ResourceForm";
import ResourceCard from "../../features/resources/components/ResourceCard";
import { useResources } from "@/features/resources/useResources";
import { useAuth } from "@/features/auth/useAuth";
import { Header } from "./Header";
import { StatsPanel } from "./StatsPanel";
import { SearchControls } from "./Filters";
import { EmptyResources } from "./EmptyResources";

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
  const { resources, addResource, updateResource, deleteResource } =
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

        {filteredResources.length === 0 && (
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
