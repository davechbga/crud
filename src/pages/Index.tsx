
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';
import Dashboard from '../components/dashboard/Dashboard';

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
