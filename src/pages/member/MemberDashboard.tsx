import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import { 
  Utensils, 
  Wallet, 
  Clock, 
  Calendar, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Info 
} from 'lucide-react';

interface MemberDashboardProps {
  onNavigate: (tab: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { 
    overallStats, 
    myFinancialSummary, 
    meals, 
    mealInfos, 
    myMealRequests, 
    announcements, 
    responsibilities 
  } = useMess();

  const todayStr = '2026-09-12';

  // Today's meal record for this member
  const todayMeal = meals.find(m => m.memberId === currentUser?.id && m.date === todayStr) || {
    breakfast: 1,
    lunch: 1,
    dinner: 1,
    guestMeals: 0
  };

  // Today's menus
  const breakfastMenu = mealInfos.find(m => m.date === todayStr && m.mealType === 'BREAKFAST')?.menu || 'Roti, Mixed Dal, Tea';
  const lunchMenu = mealInfos.find(m => m.date === todayStr && m.mealType === 'LUNCH')?.menu || 'Steamed Rice, Rui Fish Curry, Dal, Bhorta';
  const dinnerMenu = mealInfos.find(m => m.date === todayStr && m.mealType === 'DINNER')?.menu || 'Steamed Rice, Deshi Chicken Curry, Salad, Dal';

  // Duty for today
  const todayDuty = responsibilities.find(r => r.date === todayStr);
  const isMyBazar = todayDuty?.bazarDutyMemberIds.includes(currentUser?.id || '');
  const isMyCooking = todayDuty?.cookingDutyMemberIds.includes(currentUser?.id || '');
  const isMyCleaning = todayDuty?.cleaningDutyMemberIds.includes(currentUser?.id || '');

  // Balance calculation
  const balance = myFinancialSummary?.balance ?? 0;
  const isPositive = balance >= 0;

  // Recent requests
  const recentRequests = myMealRequests.slice(0, 3);
  const pendingRequestsCount = myMealRequests.filter(r => r.status === 'PENDING').length;

  // Recent announcements
  const activeNotices = announcements.slice(0, 2);

  return (
    <div className="page-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '10px' }}>
              <span>MEMBER PORTAL</span>
              <span>•</span>
              <span>{currentUser?.roomNo || 'Room 402'}</span>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Welcome back, {currentUser?.name}! 👋
            </h1>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
              Today is Saturday, 12 September 2026. Keep track of your daily meals, balances, and mess notices.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('requests')}
              className="btn btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Send size={16} />
              Submit Meal Request
            </button>
            <button
              onClick={() => onNavigate('balance')}
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Wallet size={16} />
              My Statement
            </button>
          </div>
        </div>
      </div>

      {/* Financial & Meal Stat Cards */}
      <div className="grid-responsive-4" style={{ gap: '16px' }}>
        
        {/* Balance Card */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderLeft: `4px solid ${isPositive ? '#10b981' : '#ef4444'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                My Net Balance
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: isPositive ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                ৳{Math.abs(balance).toLocaleString()}
                <span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: '6px' }}>
                  {isPositive ? '(Available)' : '(Due / ঋণ)'}
                </span>
              </div>
            </div>
            <div style={{ background: isPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: isPositive ? '#10b981' : '#ef4444', padding: '10px', borderRadius: '12px' }}>
              {isPositive ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
            </div>
          </div>
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Total Deposited:</span>
            <strong style={{ color: 'var(--text-primary)' }}>৳{(myFinancialSummary?.totalDeposited || 0).toLocaleString()}</strong>
          </div>
        </div>

        {/* Total Meals Consumed */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Total Meals This Month
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                {myFinancialSummary?.totalMealsCount || 0}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '6px' }}>meals</span>
              </div>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6', padding: '10px', borderRadius: '12px' }}>
              <Utensils size={22} />
            </div>
          </div>
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Meal Cost Deducted:</span>
            <strong style={{ color: 'var(--text-primary)' }}>৳{Math.round(myFinancialSummary?.mealCost || 0).toLocaleString()}</strong>
          </div>
        </div>

        {/* Current Live Meal Rate */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Mess Meal Rate
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                ৳{(overallStats.currentMealRate || 0).toFixed(2)}
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '6px' }}>/meal</span>
              </div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', padding: '10px', borderRadius: '12px' }}>
              <Flame size={22} />
            </div>
          </div>
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Total Bazar Spent:</span>
            <strong style={{ color: 'var(--text-primary)' }}>৳{overallStats.totalBazarCost.toLocaleString()}</strong>
          </div>
        </div>

        {/* My Requests Status */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                My Requests Status
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: pendingRequestsCount > 0 ? '#f59e0b' : '#10b981', marginTop: '4px' }}>
                {pendingRequestsCount} Pending
              </div>
            </div>
            <div style={{ background: pendingRequestsCount > 0 ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)', color: pendingRequestsCount > 0 ? '#f59e0b' : '#10b981', padding: '10px', borderRadius: '12px' }}>
              <Clock size={22} />
            </div>
          </div>
          <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Total Requests Submitted:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{myMealRequests.length}</strong>
          </div>
        </div>

      </div>

      {/* Main Grid: Today's Meals & Duty Status */}
      <div className="grid-responsive-2" style={{ gap: '20px' }}>
        
        {/* Today's Meal Plan Card */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
                <Utensils size={20} />
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Today's Meals & Menu</h2>
            </div>
            <button 
              onClick={() => onNavigate('meals')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Full Calendar <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Breakfast */}
            <div style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: todayMeal.breakfast > 0 ? 'var(--bg-main)' : '#fef2f2',
              border: `1px solid ${todayMeal.breakfast > 0 ? 'var(--border-light)' : '#fecaca'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Breakfast (সকাল)</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: todayMeal.breakfast > 0 ? '#dcfce7' : '#fee2e2',
                    color: todayMeal.breakfast > 0 ? '#15803d' : '#b91c1c'
                  }}>
                    {todayMeal.breakfast > 0 ? 'ON (১ মিল)' : 'OFF (মিল বন্ধ)'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Menu: {breakfastMenu}
                </div>
              </div>
              <button
                onClick={() => onNavigate('requests')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px', whiteSpace: 'nowrap' }}
              >
                {todayMeal.breakfast > 0 ? 'Turn Off' : 'Turn On'}
              </button>
            </div>

            {/* Lunch */}
            <div style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: todayMeal.lunch > 0 ? 'var(--bg-main)' : '#fef2f2',
              border: `1px solid ${todayMeal.lunch > 0 ? 'var(--border-light)' : '#fecaca'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Lunch (দুপুর)</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: todayMeal.lunch > 0 ? '#dcfce7' : '#fee2e2',
                    color: todayMeal.lunch > 0 ? '#15803d' : '#b91c1c'
                  }}>
                    {todayMeal.lunch > 0 ? 'ON (১ মিল)' : 'OFF (মিল বন্ধ)'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Menu: {lunchMenu}
                </div>
              </div>
              <button
                onClick={() => onNavigate('requests')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px', whiteSpace: 'nowrap' }}
              >
                {todayMeal.lunch > 0 ? 'Turn Off' : 'Turn On'}
              </button>
            </div>

            {/* Dinner */}
            <div style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: todayMeal.dinner > 0 ? 'var(--bg-main)' : '#fef2f2',
              border: `1px solid ${todayMeal.dinner > 0 ? 'var(--border-light)' : '#fecaca'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Dinner (রাত)</span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: todayMeal.dinner > 0 ? '#dcfce7' : '#fee2e2',
                    color: todayMeal.dinner > 0 ? '#15803d' : '#b91c1c'
                  }}>
                    {todayMeal.dinner > 0 ? 'ON (১ মিল)' : 'OFF (মিল বন্ধ)'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Menu: {dinnerMenu}
                </div>
              </div>
              <button
                onClick={() => onNavigate('requests')}
                className="btn btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 10px', whiteSpace: 'nowrap' }}
              >
                {todayMeal.dinner > 0 ? 'Turn Off' : 'Turn On'}
              </button>
            </div>

            {/* Guest / Extra Meals */}
            {todayMeal.guestMeals > 0 && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#065f46' }}>
                  🌟 Extra / Guest Meals Added:
                </span>
                <span style={{ fontWeight: 800, color: '#047857', fontSize: '0.9rem' }}>
                  +{todayMeal.guestMeals} meals
                </span>
              </div>
            )}

          </div>
        </div>

        {/* My Today Duty & Active Notices */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Duty Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#fef3c7', color: '#d97706', padding: '8px', borderRadius: '10px' }}>
                  <Sparkles size={20} />
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>My Responsibilities Today</h2>
              </div>
              <button 
                onClick={() => onNavigate('responsibilities')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                All Duties
              </button>
            </div>

            {isMyBazar || isMyCooking || isMyCleaning ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {isMyBazar && (
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShoppingBag size={20} color="#2563eb" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e40af' }}>Today's Bazar Duty (বাজারের দায়িত্ব)</div>
                      <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>You are scheduled for morning grocery shopping. Collect cash from Manager.</div>
                    </div>
                  </div>
                )}
                {isMyCooking && (
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: '#fff7ed', border: '1px solid #fed7aa', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Flame size={20} color="#ea580c" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#9a3412' }}>Cooking Support Duty (রান্না সহায়তা)</div>
                      <div style={{ fontSize: '0.8rem', color: '#c2410c' }}>Assist cook with vegetable cutting and meal preparation.</div>
                    </div>
                  </div>
                )}
                {isMyCleaning && (
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} color="#16a34a" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#166534' }}>Dining & Water Duty (পরিচ্ছন্নতা ও পানি)</div>
                      <div style={{ fontSize: '0.8rem', color: '#15803d' }}>Check filter water bottles and ensure clean dining table.</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>No Duties Assigned Today!</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Enjoy your meal! Check the duty schedule to view your upcoming turns.</div>
              </div>
            )}
          </div>

          {/* Latest Notice Board Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: '#ede9fe', color: '#7c3aed', padding: '8px', borderRadius: '10px' }}>
                  <Info size={20} />
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Mess Notices</h2>
              </div>
              <button 
                onClick={() => onNavigate('announcements')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                View All ({announcements.length})
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeNotices.map(notice => (
                <div 
                  key={notice.id} 
                  style={{ 
                    padding: '12px 14px', 
                    borderRadius: 'var(--radius-md)', 
                    background: notice.isImportant ? '#fff1f2' : 'var(--bg-main)', 
                    border: `1px solid ${notice.isImportant ? '#fecdd3' : 'var(--border-light)'}` 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.875rem', color: notice.isImportant ? '#be123c' : 'var(--text-primary)' }}>
                      {notice.title}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{notice.createdAt}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Recent Meal Requests Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px 0' }}>My Recent Meal Requests</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Track the status of your extra meals or meal removal submissions.
            </p>
          </div>
          <button
            onClick={() => onNavigate('requests')}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
          >
            Submit New Request
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No meal requests submitted yet. Click "Submit New Request" to turn on/off meals or add guests.
          </div>
        ) : (
          <div className="table-responsive-wrapper">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Date</th>
                  <th style={{ padding: '10px 12px' }}>Type</th>
                  <th style={{ padding: '10px 12px' }}>Meal</th>
                  <th style={{ padding: '10px 12px' }}>Reason / Note</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px' }}>Manager Response</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(req => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{req.date}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: req.requestType === 'EXTRA_MEAL' ? '#eff6ff' : '#fef2f2',
                        color: req.requestType === 'EXTRA_MEAL' ? '#2563eb' : '#dc2626'
                      }}>
                        {req.requestType === 'EXTRA_MEAL' ? `+${req.extraCount || 1} Extra Meal` : 'Meal Removal'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{req.mealType}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{req.reason || '—'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: req.status === 'APPROVED' ? '#dcfce7' : req.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                        color: req.status === 'APPROVED' ? '#15803d' : req.status === 'PENDING' ? '#b45309' : '#b91c1c'
                      }}>
                        {req.status === 'APPROVED' && <CheckCircle2 size={12} />}
                        {req.status === 'PENDING' && <Clock size={12} />}
                        {req.status === 'DECLINED' && <XCircle size={12} />}
                        {req.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {req.responseNote || 'Awaiting Manager Review'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
