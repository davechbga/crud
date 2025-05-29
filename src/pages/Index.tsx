
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthForm from '../features/auth/AuthForm';
import Dashboard from '../components/Dashboard';

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
