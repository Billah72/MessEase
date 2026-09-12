import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import { 
  LayoutDashboard, 
  Utensils, 
  Wallet, 
  Send, 
  Sparkles, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  CheckCircle2,
  Clock,
  UserCheck
} from 'lucide-react';

import { MemberDashboard } from '../../pages/member/MemberDashboard';
import { MemberMealsPage } from '../../pages/member/MemberMealsPage';
import { MemberMealRequestsPage } from '../../pages/member/MemberMealRequestsPage';
import { MemberBalancePage } from '../../pages/member/MemberBalancePage';
import { MemberResponsibilitiesPage } from '../../pages/member/MemberResponsibilitiesPage';
import { MemberAnnouncementsPage } from '../../pages/member/MemberAnnouncementsPage';
import { MemberProfilePage } from '../../pages/member/MemberProfilePage';

export const MemberLayout: React.FC = () => {
  const { currentUser, users, switchDemoUser, logout } = useAuth();
  const { 
    settings, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    myMealRequests, 
    myFinancialSummary,
    overallStats 
  } = useMess();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);

  const pendingRequestsCount = myMealRequests.filter(r => r.status === 'PENDING').length;
  const unreadNotifications = notifications.filter(n => !n.isRead && (n.userId === 'ALL' || n.userId === currentUser?.id));

  const navItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Meal Requests', icon: Send, badge: pendingRequestsCount },
    { id: 'meals', label: 'Daily Meal Log', icon: Utensils },
    { id: 'balance', label: 'My Balance & Ledger', icon: Wallet },
    { id: 'responsibilities', label: 'Duty Schedule', icon: Sparkles },
    { id: 'announcements', label: 'Notice Board', icon: Bell },
    { id: 'profile', label: 'Profile & Password', icon: UserIcon },
  ];

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MemberDashboard onNavigate={setActiveTab} />;
      case 'requests':
        return <MemberMealRequestsPage />;
      case 'meals':
        return <MemberMealsPage onNavigateToRequests={() => setActiveTab('requests')} />;
      case 'balance':
        return <MemberBalancePage />;
      case 'responsibilities':
        return <MemberResponsibilitiesPage />;
      case 'announcements':
        return <MemberAnnouncementsPage />;
      case 'profile':
        return <MemberProfilePage />;
      default:
        return <MemberDashboard onNavigate={setActiveTab} />;
    }
  };

  const balance = myFinancialSummary?.balance ?? 0;
  const isPositive = balance >= 0;

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop" style={{
        width: '260px',
        background: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 40,
        borderRight: '1px solid rgba(255,255,255,0.08)'
      }}>
        {/* Brand */}
        <div style={{ padding: '20px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(59,130,246,0.4)' }}>
            🍽️
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
              {settings.messName}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>
              Member Portal
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? '#3b82f6' : 'transparent',
                  color: isActive ? 'white' : '#cbd5e1',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={isActive ? 'white' : '#94a3b8'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span style={{
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: isActive ? 'white' : '#f59e0b',
                    color: isActive ? '#1e40af' : 'white',
                    fontSize: '0.7rem',
                    fontWeight: 800
                  }}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Member User Pill */}
        <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                alt="Member" 
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.name || 'Member'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{currentUser?.roomNo || 'Room 402'}</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log Out"
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header */}
        <header style={{
          height: '64px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          {/* Left: Mobile hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="mobile-only-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '6px' }}
            >
              <Menu size={22} />
            </button>

            <div className="mobile-only-btn" style={{ fontWeight: 800, fontSize: '1rem' }}>
              {settings.messName}
            </div>

            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Meal Rate:
                </span>
                <span style={{
                  background: 'rgba(245,158,11,0.12)',
                  color: '#d97706',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  ৳{(overallStats.currentMealRate || 0).toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  My Balance:
                </span>
                <span style={{
                  background: isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                  color: isPositive ? '#10b981' : '#ef4444',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  ৳{Math.abs(balance).toLocaleString()} {isPositive ? '(Avail)' : '(Due)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Notifications, Quick Switcher, Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Quick Request Button */}
            <button
              onClick={() => setActiveTab('requests')}
              className="desktop-only btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={14} /> Request Meal
            </button>

            {/* Notification Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowUserMenu(false);
                }}
                className="btn btn-secondary"
                style={{ width: '38px', height: '38px', padding: 0, position: 'relative', borderRadius: '50%' }}
              >
                <Bell size={18} />
                {unreadNotifications.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#ef4444',
                    color: 'white',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '320px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border-light)',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Notifications</span>
                    {unreadNotifications.length > 0 && (
                      <button onClick={markAllNotificationsAsRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {unreadNotifications.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No new notifications</div>
                    ) : (
                      unreadNotifications.map(n => (
                        <div key={n.id} onClick={() => markNotificationAsRead(n.id)} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', background: 'rgba(59,130,246,0.06)' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{n.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Demo Switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 4px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                <img 
                  src={currentUser?.avatarUrl} 
                  alt={currentUser?.name} 
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {currentUser?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  width: '260px',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border-light)',
                  zIndex: 100,
                  padding: '8px'
                }}>
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-light)', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Switch User Role (Demo)
                    </div>
                  </div>
                  <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchDemoUser(u.id);
                          setShowUserMenu(false);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          background: u.id === currentUser?.id ? 'rgba(59,130,246,0.1)' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <img src={u.avatarUrl} alt={u.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{u.role}</div>
                        </div>
                        {u.id === currentUser?.id && <UserCheck size={14} color="#3b82f6" />}
                      </button>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '6px', paddingTop: '6px' }}>
                    <button
                      onClick={logout}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: '#fee2e2',
                        color: '#b91c1c',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 999,
              display: 'flex'
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div 
              style={{
                width: '280px',
                height: '100%',
                background: '#0f172a',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 14px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#60a5fa' }}>Member Menu</div>
                <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: activeTab === item.id ? '#3b82f6' : 'transparent',
                      color: activeTab === item.id ? 'white' : '#cbd5e1',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span style={{ background: '#f59e0b', color: 'white', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '24px 20px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {renderActivePage()}
        </main>

      </div>

    </div>
  );
};
