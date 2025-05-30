import Dashboard from "@/components/dashboard/Dashboard";
import AuthForm from "../features/auth/components/AuthForm";
import { AuthProvider, useAuth } from "@/features/auth/hooks/useAuth";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <Dashboard /> : <AuthForm />}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
