import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MessProvider } from './context/MessContext';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ManagerRegisterPage } from './pages/auth/ManagerRegisterPage';

// Layouts
import { ManagerLayout } from './components/layout/ManagerLayout';
import { MemberLayout } from './components/layout/MemberLayout';

const checkIsRegisterRoute = () => {
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path.includes('manager-registration') ||
    path.includes('manager/register') ||
    hash.includes('manager-registration') ||
    hash.includes('manager/register') ||
    search.includes('manager-registration') ||
    search.includes('manager/register')
  );
};

const AppContent: React.FC = () => {
  const { currentUser, isAuthenticated, isManager, isMember } = useAuth();
  const [isRegisterRoute, setIsRegisterRoute] = useState<boolean>(checkIsRegisterRoute());

  React.useEffect(() => {
    const handleLocationChange = () => {
      setIsRegisterRoute(checkIsRegisterRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // If user is authenticated, render the respective layout based strictly on role
  if (isAuthenticated && currentUser) {
    if (isManager) {
      return <ManagerLayout />;
    }
    if (isMember) {
      return <MemberLayout />;
    }
  }

  // If accessed via secret Manager Registration URL:
  if (isRegisterRoute) {
    return (
      <ManagerRegisterPage
        onBackToLanding={() => {
          window.history.pushState({}, '', '/');
          setIsRegisterRoute(false);
        }}
        onGoToLogin={() => {
          window.history.pushState({}, '', '/');
          setIsRegisterRoute(false);
        }}
      />
    );
  }

  // Otherwise, default directly to clean & simple LoginPage (zero registration links)
  return <LoginPage />;
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
