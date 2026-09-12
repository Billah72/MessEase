import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  Wallet, 
  Users, 
  FileText, 
  Sparkles, 
  Bell, 
  Settings, 
  Inbox, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  UserCheck
} from 'lucide-react';

import { ManagerDashboard } from '../../pages/manager/ManagerDashboard';
import { ManagerMealRequestsPage } from '../../pages/manager/ManagerMealRequestsPage';
import { ManagerMembersPage } from '../../pages/manager/ManagerMembersPage';
import { ManagerMealsPage } from '../../pages/manager/ManagerMealsPage';
import { ManagerBazarPage } from '../../pages/manager/ManagerBazarPage';
import { ManagerFinancePage } from '../../pages/manager/ManagerFinancePage';
import { ManagerResponsibilitiesPage } from '../../pages/manager/ManagerResponsibilitiesPage';
import { ManagerAnnouncementsPage } from '../../pages/manager/ManagerAnnouncementsPage';
import { ManagerReportsPage } from '../../pages/manager/ManagerReportsPage';
import { ManagerSettingsPage } from '../../pages/manager/ManagerSettingsPage';

export const ManagerLayout: React.FC = () => {
  const { currentUser, users, switchDemoUser, logout } = useAuth();
  const { 
    settings, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    mealRequests, 
    overallStats 
  } = useMess();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showNotifMenu, setShowNotifMenu] = useState<boolean>(false);

  const pendingRequestsCount = mealRequests.filter(r => r.status === 'PENDING').length;
  const unreadNotifications = notifications.filter(n => !n.isRead);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests', label: 'Meal Requests', icon: Inbox, badge: pendingRequestsCount },
    { id: 'meals', label: 'Daily Meals', icon: Utensils },
    { id: 'members', label: 'Member Accounts', icon: Users },
    { id: 'bazar', label: 'Bazar Log', icon: ShoppingBag },
    { id: 'finance', label: 'Treasury & Finance', icon: Wallet },
    { id: 'responsibilities', label: 'Duty Rotation', icon: Sparkles },
    { id: 'announcements', label: 'Notice Board', icon: Bell },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'settings', label: 'Mess Settings', icon: Settings },
  ];

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ManagerDashboard onNavigate={setActiveTab} />;
      case 'requests':
        return <ManagerMealRequestsPage />;
      case 'meals':
        return <ManagerMealsPage />;
      case 'members':
        return <ManagerMembersPage />;
      case 'bazar':
        return <ManagerBazarPage />;
      case 'finance':
        return <ManagerFinancePage />;
      case 'responsibilities':
        return <ManagerResponsibilitiesPage />;
      case 'announcements':
        return <ManagerAnnouncementsPage />;
      case 'reports':
        return <ManagerReportsPage />;
      case 'settings':
        return <ManagerSettingsPage />;
      default:
        return <ManagerDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop" style={{
        width: '260px',
        background: 'var(--bg-sidebar)',
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
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #047857)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 2px 8px rgba(16,185,129,0.4)' }}>
            👑
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>
              {settings.messName}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
              Manager Control Center
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
                  background: isActive ? '#10b981' : 'transparent',
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
                    background: isActive ? 'white' : '#ef4444',
                    color: isActive ? '#10b981' : 'white',
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

        {/* Manager User Pill */}
        <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                alt="Manager" 
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.name || 'Manager'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Manager</div>
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

            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Live Meal Rate:
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
          </div>

          {/* Right: Notifications, Quick Switcher, Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Pending Requests Shortcut */}
            {pendingRequestsCount > 0 && (
              <button
                onClick={() => setActiveTab('requests')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fef3c7',
                  border: '1px solid #fde047',
                  color: '#92400e',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Inbox size={14} />
                <span>{pendingRequestsCount} New Requests</span>
              </button>
            )}

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
                    {notifications.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No notifications</div>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div key={n.id} onClick={() => markNotificationAsRead(n.id)} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', background: n.isRead ? 'transparent' : 'rgba(16,185,129,0.06)' }}>
                          <div style={{ fontWeight: n.isRead ? 600 : 700, fontSize: '0.8rem' }}>{n.title}</div>
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
                          background: u.id === currentUser?.id ? 'var(--primary-light)' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <img src={u.avatarUrl} alt={u.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{u.role}</div>
                        </div>
                        {u.id === currentUser?.id && <UserCheck size={14} color="var(--primary)" />}
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
                background: 'var(--bg-sidebar)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 14px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#10b981' }}>Manager Menu</div>
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
                      background: activeTab === item.id ? '#10b981' : 'transparent',
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
                      <span style={{ background: '#ef4444', color: 'white', padding: '1px 6px', borderRadius: '10px', fontSize: '0.7rem' }}>
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
