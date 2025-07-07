
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import AuthForm from '@/components/AuthForm';
import TaskList from '@/components/TaskList';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsGuest(false); // Reset guest mode when auth state changes
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (email: string) => {
    // The actual login is handled by Supabase auth state change
    // This is just for backward compatibility
  };

  const handleGuestLogin = () => {
    setIsGuest(true);
  };

  const handleLogout = async () => {
    if (isGuest) {
      setIsGuest(false);
    } else {
      await supabase.auth.signOut();
    }
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

  return (user || isGuest) ? (
    <TaskList 
      userEmail={user?.email || 'Guest'} 
      onLogout={handleLogout}
      isGuest={isGuest}
    />
  ) : (
    <AuthForm onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
  );
};

export default Index;
