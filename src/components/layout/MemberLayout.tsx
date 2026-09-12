import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
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

  // Desktop collapsible sidebar
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('mess_member_sidebar_collapsed') === 'true';
  });

  const toggleSidebarCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('mess_member_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
    <div className="app-shell">
      
      {/* Desktop Sidebar */}
      <aside className={`sidebar-desktop ${isCollapsed ? 'collapsed' : ''}`}>
        
        {/* Brand Header */}
        <div style={{
          padding: isCollapsed ? '16px 12px' : '18px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          minHeight: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(59,130,246,0.35)'
            }}>
              🍽️
            </div>
            {!isCollapsed && (
              <div style={{ overflow: 'hidden', minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.925rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em', color: '#f8fafc' }}>
                  {settings.messName}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Member Portal
                </div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={toggleSidebarCollapse}
              title="Collapse sidebar"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className={isCollapsed ? 'tooltip-wrapper' : undefined}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    width: '100%',
                    minHeight: '42px',
                    padding: isCollapsed ? '8px' : '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? '#3b82f6' : 'transparent',
                    color: isActive ? 'white' : '#cbd5e1',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={19} color={isActive ? 'white' : '#94a3b8'} style={{ flexShrink: 0 }} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>

                  {/* Badge */}
                  {item.badge && item.badge > 0 ? (
                    isCollapsed ? (
                      <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#f59e0b'
                      }} />
                    ) : (
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
                    )
                  ) : null}
                </button>

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <span className="sidebar-tooltip">
                    {item.label}
                    {item.badge && item.badge > 0 ? ` (${item.badge})` : ''}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer / Profile & Expand Button */}
        <div style={{
          padding: isCollapsed ? '12px 8px' : '14px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {isCollapsed ? (
            <button
              onClick={toggleSidebarCollapse}
              title="Expand sidebar"
              style={{
                width: '100%',
                minHeight: '36px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#60a5fa',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronRight size={18} />
            </button>
          ) : null}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <img 
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                alt="Member" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid #3b82f6' }}
              />
              {!isCollapsed && (
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.825rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>
                    {currentUser?.name || 'Member'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{currentUser?.roomNo || 'Room 402'}</div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={logout}
                title="Log Out"
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

      </aside>

      {/* Main Content Wrapper */}
      <div className="main-wrapper">
        
        {/* Top Header */}
        <header className="header-container">
          
          {/* Left: Mobile Drawer Trigger + App Name / Live Rate */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            
            {/* Mobile Hamburger Button (44px target) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              style={{
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--slate-100)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                color: 'var(--slate-800)',
                padding: 0
              }}
              className="mobile-only-btn"
            >
              <Menu size={20} />
            </button>

            {/* Brand Logo & Title on Mobile */}
            <div className="mobile-only-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
              <span style={{ fontSize: '1.1rem' }}>🍽️</span>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--slate-900)' }}>
                {settings.messName}
              </span>
            </div>

            {/* Desktop Rate & Balance Pills */}
            <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Meal Rate:
                </span>
                <span style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  color: '#b45309',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '0.825rem'
                }}>
                  ৳{(overallStats.currentMealRate || 0).toFixed(2)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  My Balance:
                </span>
                <span style={{
                  background: isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                  border: `1px solid ${isPositive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  color: isPositive ? '#047857' : '#b91c1c',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 800,
                  fontSize: '0.825rem'
                }}>
                  ৳{Math.abs(balance).toLocaleString()} {isPositive ? '(Avail)' : '(Due)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Request Button, Notifications, User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Quick Request Button (Desktop) */}
            <button
              onClick={() => setActiveTab('requests')}
              className="desktop-only btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '6px 12px', minHeight: '36px' }}
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
                className="btn btn-secondary btn-icon-only"
                style={{ position: 'relative' }}
                aria-label="Notifications"
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
                    justifyContent: 'center',
                    border: '2px solid white'
                  }}>
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div style={{
                  position: 'fixed',
                  top: '68px',
                  right: '12px',
                  width: 'min(330px, calc(100vw - 24px))',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border-light)',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Notifications</span>
                    {unreadNotifications.length > 0 && (
                      <button onClick={markAllNotificationsAsRead} style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {unreadNotifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No new notifications</div>
                    ) : (
                      unreadNotifications.map(n => (
                        <div key={n.id} onClick={() => markNotificationAsRead(n.id)} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', background: 'rgba(59,130,246,0.06)' }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--slate-900)' }}>{n.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Demo User Switcher */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 8px 3px 3px',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  minHeight: '38px'
                }}
              >
                <img 
                  src={currentUser?.avatarUrl} 
                  alt={currentUser?.name} 
                  style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span className="desktop-only" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                  {currentUser?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--slate-500)" />
              </button>

              {showUserMenu && (
                <div style={{
                  position: 'fixed',
                  top: '68px',
                  right: '12px',
                  width: 'min(280px, calc(100vw - 24px))',
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
                        <img src={u.avatarUrl} alt={u.name} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
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
            className="mobile-drawer-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div 
              className="mobile-drawer-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🍽️</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>{settings.messName}</div>
                    <div style={{ fontSize: '0.68rem', color: '#60a5fa', fontWeight: 700 }}>MEMBER MENU</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }}>
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: isActive ? '#3b82f6' : 'transparent',
                        color: isActive ? 'white' : '#cbd5e1',
                        border: 'none',
                        textAlign: 'left',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        minHeight: '44px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icon size={18} color={isActive ? 'white' : '#94a3b8'} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span style={{ background: '#f59e0b', color: 'white', padding: '2px 7px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginTop: '10px' }}>
                <button
                  onClick={logout}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: '#fee2e2',
                    color: '#b91c1c',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    minHeight: '44px'
                  }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Container */}
        <main className="page-content-wrapper">
          {renderActivePage()}
        </main>

      </div>

    </div>
  );
};
