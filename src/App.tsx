import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MessProvider } from './context/MessContext';

// Auth Pages
import { LandingPage } from './pages/auth/LandingPage';
import { ManagerLoginPage } from './pages/auth/ManagerLoginPage';
import { ManagerRegisterPage } from './pages/auth/ManagerRegisterPage';
import { MemberLoginPage } from './pages/auth/MemberLoginPage';

// Layouts
import { ManagerLayout } from './components/layout/ManagerLayout';
import { MemberLayout } from './components/layout/MemberLayout';

type AuthView = 'LANDING' | 'MANAGER_LOGIN' | 'MANAGER_REGISTER' | 'MEMBER_LOGIN';

const AppContent: React.FC = () => {
  const { currentUser, isAuthenticated, isManager, isMember } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('LANDING');

  // If user is authenticated, render the respective layout based strictly on role
  if (isAuthenticated && currentUser) {
    if (isManager) {
      return <ManagerLayout />;
    }
    if (isMember) {
      return <MemberLayout />;
    }
  }

  // Otherwise, render the appropriate auth flow screen
  switch (authView) {
    case 'MANAGER_LOGIN':
      return (
        <ManagerLoginPage 
          onBackToLanding={() => setAuthView('LANDING')}
          onGoToRegister={() => setAuthView('MANAGER_REGISTER')}
        />
      );
    case 'MANAGER_REGISTER':
      return (
        <ManagerRegisterPage 
          onBackToLanding={() => setAuthView('LANDING')}
          onGoToLogin={() => setAuthView('MANAGER_LOGIN')}
        />
      );
    case 'MEMBER_LOGIN':
      return (
        <MemberLoginPage 
          onBackToLanding={() => setAuthView('LANDING')}
        />
      );
    case 'LANDING':
    default:
      return (
        <LandingPage 
          onNavigateAuth={(view) => setAuthView(view)}
        />
      );
  }
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MessProvider>
        <AppContent />
      </MessProvider>
    </AuthProvider>
  );
};

export default App;
