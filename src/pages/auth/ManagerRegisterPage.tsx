import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Building, User, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ManagerRegisterPageProps {
  onBackToLanding: () => void;
  onGoToLogin: () => void;
}

export const ManagerRegisterPage: React.FC<ManagerRegisterPageProps> = ({ onBackToLanding, onGoToLogin }) => {
  const { registerManagerWithGoogle } = useAuth();

  const [managerName, setManagerName] = useState('Sakib Hasan');
  const [managerEmail, setManagerEmail] = useState('manager@greenview.com');
  const [messName, setMessName] = useState('Green View Mess');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      registerManagerWithGoogle(managerName, managerEmail, messName);
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
        maxWidth: '460px',
        width: '100%',
        boxShadow: 'var(--shadow-xl)'
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
            marginBottom: '16px'
          }}
        >
          <ArrowLeft size={16} /> Back to Portal Selection
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'var(--primary-50)',
            color: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Manager Registration
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Register your Google account and initialize your mess management system.
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">Manager Full Name</label>
            <input 
              type="text"
              required
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="form-control"
              placeholder="e.g. Sakib Hasan"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gmail / Google Email</label>
            <input 
              type="email"
              required
              value={managerEmail}
              onChange={(e) => setManagerEmail(e.target.value)}
              className="form-control"
              placeholder="manager@gmail.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Shared Mess Name</label>
            <input 
              type="text"
              required
              value={messName}
              onChange={(e) => setMessName(e.target.value)}
              className="form-control"
              placeholder="e.g. Green View Mess"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '12px' }}
          >
            {loading ? 'Setting up Mess...' : 'Register with Google & Start Managing'}
          </button>
        </form>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Already have a manager account?{' '}
          <button
            onClick={onGoToLogin}
            style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 700, cursor: 'pointer' }}
          >
            Manager Login
          </button>
        </div>
      </div>
    </div>
  );
};
