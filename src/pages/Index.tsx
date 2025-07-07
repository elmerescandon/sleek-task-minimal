
import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import TaskList from '@/components/TaskList';

const Index = () => {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (localStorage persistence)
    const savedUser = localStorage.getItem('taskapp_user');
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string) => {
    setUser(email);
    localStorage.setItem('taskapp_user', email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taskapp_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? (
    <TaskList userEmail={user} onLogout={handleLogout} />
  ) : (
    <AuthForm onLogin={handleLogin} />
  );
};

export default Index;
