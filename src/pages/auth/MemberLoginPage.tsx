import React, { useState } from 'react';
import { User, ArrowLeft, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';

interface MemberLoginPageProps {
  onBackToLanding: () => void;
}

export const MemberLoginPage: React.FC<MemberLoginPageProps> = ({ onBackToLanding }) => {
  const { loginMemberWithCredentials, users } = useAuth();
  const { settings } = useMess();

  const [email, setEmail] = useState('arifur@gmail.com');
  const [password, setPassword] = useState('member123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const res = loginMemberWithCredentials(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Login failed');
      }
      setLoading(false);
    }, 400);
  };

  const members = users.filter(u => u.role === 'MEMBER');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #020617 100%)',
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

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'var(--info-50)',
            color: 'var(--info-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <User size={28} />
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Member Login
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            {settings.messName} • Enter credentials provided by your Mess Manager
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'var(--danger-50)',
            border: '1px solid var(--danger-100)',
            color: 'var(--danger-700)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} color="var(--danger-600)" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin}>
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
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Logging in...' : 'Sign In to Member Dashboard'}
          </button>
        </form>

        {/* Informative notice */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: 'var(--slate-50)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          lineHeight: 1.4
        }}>
          💡 <strong>Notice:</strong> Members cannot register publicly. If you live in this mess and don't have login credentials, please ask the Manager (Sakib) to create your account.
        </div>

        {/* Quick Member select for evaluation */}
        <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px', textAlign: 'center' }}>
            Quick fill demo accounts:
          </div>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {members.slice(0, 3).map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setEmail(m.email);
                  setPassword('member123');
                }}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '0.7rem', padding: '3px 8px' }}
              >
                {m.name.split(' ')[0]} ({m.roomNo})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
