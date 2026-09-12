import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';

export const LoginPage: React.FC = () => {
  const { loginMemberWithCredentials, loginManagerWithGoogle, users } = useAuth();
  const { settings } = useMess();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      // Check if this is the manager's email trying password/login
      const manager = users.find(u => u.email.toLowerCase() === trimmedEmail && u.role === 'MANAGER');
      if (manager) {
        loginManagerWithGoogle();
        setLoading(false);
        return;
      }

      // Otherwise attempt member login
      const res = loginMemberWithCredentials(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'radial-gradient(ellipse at 50% 20%, #2e1065 0%, #0f172a 45%, #020617 100%)',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Ambient Glows */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 51, 234, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(40px)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        filter: 'blur(50px)'
      }} />

      {/* Subtle Starry Dots */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
        opacity: 0.4,
        pointerEvents: 'none'
      }} />

      {/* Glassmorphism Login Card */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '460px',
        background: 'rgba(20, 24, 40, 0.65)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '28px',
        padding: 'clamp(28px, 6vw, 44px) clamp(20px, 5vw, 36px)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(147, 51, 234, 0.08)',
        color: '#ffffff'
      }}>
        
        {/* Glowing Top Icon */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
            color: '#e2e8f0'
          }}>
            <Sparkles size={24} color="#c084fc" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.1rem)',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 8px 0',
            letterSpacing: '-0.02em'
          }}>
            Welcome back!
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            margin: 0,
            lineHeight: 1.5,
            maxWidth: '360px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Sign in to access {settings.messName}, daily meals, expenses, and personal ledger
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '0.825rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Email Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#94a3b8',
              marginBottom: '8px'
            }}>
              Email
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#ffffff',
                fontSize: '0.925rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#a855f7';
                e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: '#94a3b8',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '13px 44px 13px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#ffffff',
                  fontSize: '0.925rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#a855f7';
                  e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.825rem',
            color: '#cbd5e1'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  accentColor: '#9333ea',
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer'
                }}
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Primary Log In Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '50px',
              background: '#ffffff',
              color: '#0f172a',
              fontSize: '0.95rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255, 255, 255, 0.15)',
              transition: 'all 0.15s ease',
              marginTop: '4px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

      </div>
    </div>
  );
};
