import Dashboard from "@/components/dashboard/Dashboard";
import { AuthProvider, useAuth } from "@/features/auth/hooks/useAuth";
import LoginPage from "./LoginPage";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <Dashboard /> : <LoginPage />}
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
