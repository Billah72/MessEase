import React from 'react';
import { 
  ShieldCheck, 
  User, 
  UtensilsCrossed, 
  Receipt, 
  MessageSquarePlus, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';

interface LandingPageProps {
  onNavigateAuth: (view: 'LANDING' | 'MANAGER_LOGIN' | 'MANAGER_REGISTER' | 'MEMBER_LOGIN') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateAuth }) => {
  const { switchDemoUser, users } = useAuth();
  const { settings } = useMess();

  const manager = users.find(u => u.role === 'MANAGER') || users[0];
  const members = users.filter(u => u.role === 'MEMBER');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #020617 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Background subtle glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Brand Bar */}
      <header style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #047857)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}>
            🍽️
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#f8fafc', letterSpacing: '-0.02em' }}>
              {settings.messName}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Dhanmondi, Dhaka • 2-Role Mess Management
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => onNavigateAuth('MANAGER_REGISTER')}
            className="btn btn-sm btn-outline"
            style={{ color: '#cbd5e1', borderColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            Manager Registration
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{
        maxWidth: '1000px',
        margin: '32px auto',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.825rem',
          fontWeight: 700,
          color: '#34d399',
          marginBottom: '20px'
        }}>
          <Sparkles size={16} /> Bangladeshi Shared Mess System (Manager & Member)
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 800,
          color: 'white',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '16px'
        }}>
          Mess Management System
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          color: '#94a3b8',
          maxWidth: '680px',
          margin: '0 auto 36px auto',
          lineHeight: 1.6
        }}>
          Manage meals, members, expenses, requests, and daily mess activities in one place with automated meal rates and instant request approval.
        </p>

        {/* 2 Main Portal Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          textAlign: 'left'
        }}>
          {/* 1. Manager Portal Card */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 20px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform var(--transition-fast)'
          }}>
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399',
                marginBottom: '16px'
              }}>
                <ShieldCheck size={26} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ color: 'white', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  Manager Portal
                </h2>
                <span className="badge badge-success">Full Control</span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '8px 0 20px 0', lineHeight: 1.5 }}>
                Controls mess treasury, approves/declines meal requests, logs bazar shopping, manages member credentials, and configures mess rules.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#34d399" /> Google OAuth Sign-in
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#34d399" /> 1-Click Meal Request Approval & Auto-Sync
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#34d399" /> Treasury, Bazar & Member Management
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateAuth('MANAGER_LOGIN')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', fontSize: '1rem', fontWeight: 700 }}
            >
              Manager Login (Google) <ArrowRight size={18} />
            </button>
          </div>

          {/* 2. Member Portal Card */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 30px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform var(--transition-fast)'
          }}>
            <div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                marginBottom: '16px'
              }}>
                <User size={26} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ color: 'white', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  Member Portal
                </h2>
                <span className="badge badge-info">Credentials</span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '8px 0 20px 0', lineHeight: 1.5 }}>
                View personal meals, submit Extra Meal or Meal Removal requests, check personal balances, and view assigned duties.
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '0.825rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#38bdf8" /> Login with Manager-provided email & password
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#38bdf8" /> Submit Extra Meal & Meal Removal Requests
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} color="#38bdf8" /> 100% Private Personal Financial Ledger
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigateAuth('MEMBER_LOGIN')}
              className="btn btn-secondary btn-lg"
              style={{ width: '100%', fontSize: '1rem', fontWeight: 700, background: 'white', color: 'var(--slate-900)' }}
            >
              Member Login <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Quick Demo Access Bar */}
        <div style={{
          marginTop: '40px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#f8fafc' }}>
              ⚡ 1-Click Evaluation Access
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Test both user roles instantly:
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => switchDemoUser(manager.id)}
              className="btn btn-sm btn-primary"
            >
              <ShieldCheck size={14} /> Log in as Manager ({manager.name.split(' ')[0]})
            </button>
            <button
              onClick={() => switchDemoUser(members[0].id)}
              className="btn btn-sm btn-outline"
              style={{ color: '#38bdf8', borderColor: '#38bdf8' }}
            >
              <User size={14} /> Log in as Member ({members[0].name.split(' ')[0]})
            </button>
            <button
              onClick={() => switchDemoUser(members[1].id)}
              className="btn btn-sm btn-outline"
              style={{ color: '#cbd5e1', borderColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <User size={14} /> Member ({members[1].name.split(' ')[0]})
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
        padding: '16px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.78rem',
        color: '#64748b'
      }}>
        {settings.messName} • Manager & Member Roles Only • Built for Bangladesh Shared Mess Living
      </footer>
    </div>
  );
};
