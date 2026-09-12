import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';

interface ManagerLoginPageProps {
  onBackToLanding: () => void;
  onGoToRegister: () => void;
}

export const ManagerLoginPage: React.FC<ManagerLoginPageProps> = ({ onBackToLanding, onGoToRegister }) => {
  const { loginManagerWithGoogle } = useAuth();
  const { settings } = useMess();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      loginManagerWithGoogle();
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 60%, #020617 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 32px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: 'var(--shadow-xl)',
        textAlign: 'center'
      }}>
        <button
          onClick={onBackToLanding}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--slate-500)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={16} /> Back to Portal Selection
        </button>

        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'var(--primary-50)',
          color: 'var(--primary-600)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto'
        }}>
          <ShieldCheck size={32} />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
          Manager Login
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '6px 0 24px 0' }}>
          {settings.messName} • Sign in to access full mess administration & finance controls.
        </p>

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: '#1e293b',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
        >
          {/* Google Icon SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {loading ? 'Authenticating with Google...' : 'Continue with Google'}
        </button>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Need to create a new mess account?{' '}
          <button
            onClick={onGoToRegister}
            style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 700, cursor: 'pointer' }}
          >
            Register as Manager
          </button>
        </div>
      </div>
    </div>
  );
};
