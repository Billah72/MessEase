import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';

interface LoginPageProps {
  defaultTab?: 'MEMBER' | 'MANAGER';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultTab = 'MEMBER' }) => {
  const { loginMemberWithCredentials, loginManagerWithGoogle, switchDemoUser, users } = useAuth();
  const { settings } = useMess();

  const [activeTab, setActiveTab] = useState<'MEMBER' | 'MANAGER'>(defaultTab);

  // Member login state
  const [email, setEmail] = useState('arifur@gmail.com');
  const [password, setPassword] = useState('member123');
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);

  // Manager login state
  const [managerLoading, setManagerLoading] = useState(false);

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError(null);
    setMemberLoading(true);

    setTimeout(() => {
      const res = loginMemberWithCredentials(email, password);
      if (!res.success) {
        setMemberError(res.error || 'Invalid email or password.');
      }
      setMemberLoading(false);
    }, 400);
  };

  const handleManagerGoogleSignIn = () => {
    setManagerLoading(true);
    setTimeout(() => {
      loginManagerWithGoogle();
      setManagerLoading(false);
    }, 500);
  };

  const members = users.filter(u => u.role === 'MEMBER');
  const manager = users.find(u => u.role === 'MANAGER');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 60%, #020617 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 14px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '36px 28px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: activeTab === 'MANAGER' ? 'var(--primary-50)' : 'var(--info-50)',
            color: activeTab === 'MANAGER' ? 'var(--primary-600)' : 'var(--info-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            transition: 'all 0.2s ease'
          }}>
            {activeTab === 'MANAGER' ? <ShieldCheck size={30} /> : <User size={30} />}
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 4px 0' }}>
            {settings.messName}
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
            Sign in to access your shared mess account
          </p>
        </div>

        {/* Tab Switcher: Member vs Manager */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--slate-100)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('MEMBER');
              setMemberError(null);
            }}
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'MEMBER' ? 'white' : 'transparent',
              color: activeTab === 'MEMBER' ? 'var(--slate-900)' : 'var(--slate-600)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'MEMBER' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <User size={15} /> Member Login
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('MANAGER');
              setMemberError(null);
            }}
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'MANAGER' ? 'white' : 'transparent',
              color: activeTab === 'MANAGER' ? 'var(--primary-700)' : 'var(--slate-600)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'MANAGER' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <ShieldCheck size={15} /> Manager Login
          </button>
        </div>

        {/* Member Form */}
        {activeTab === 'MEMBER' && (
          <form onSubmit={handleMemberSubmit}>
            {memberError && (
              <div style={{
                background: 'var(--danger-50)',
                border: '1px solid var(--danger-100)',
                color: 'var(--danger-700)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <AlertCircle size={16} color="var(--danger-600)" style={{ flexShrink: 0 }} />
                <span>{memberError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Member Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '36px' }}
                  placeholder="e.g. arifur@gmail.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '36px' }}
                  placeholder="Enter member password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={memberLoading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '8px' }}
            >
              {memberLoading ? 'Signing In...' : 'Sign In as Member'}
            </button>
          </form>
        )}

        {/* Manager Google Sign In Form */}
        {activeTab === 'MANAGER' && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', textAlign: 'center', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Sign in with your authorized Google Account to manage meals, expenses, and members.
            </p>

            <button
              type="button"
              onClick={handleManagerGoogleSignIn}
              disabled={managerLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
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
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#94a3b8'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
            >
              {/* Google Icon SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {managerLoading ? 'Signing In with Google...' : 'Continue with Google'}
            </button>
          </div>
        )}

        {/* Quick Demo Access Bar for Evaluation */}
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--slate-100)', paddingTop: '16px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center', fontWeight: 600 }}>
            ⚡ 1-Click Evaluation Login:
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {manager && (
              <button
                type="button"
                onClick={() => switchDemoUser(manager.id)}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.72rem', padding: '3px 8px', color: 'var(--primary-700)', borderColor: 'var(--primary-300)' }}
              >
                Manager ({manager.name.split(' ')[0]})
              </button>
            )}
            {members.slice(0, 3).map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => switchDemoUser(m.id)}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                Member ({m.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
