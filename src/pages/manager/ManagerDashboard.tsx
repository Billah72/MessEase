import React from 'react';
import { 
  Wallet, 
  UtensilsCrossed, 
  Users, 
  TrendingUp, 
  DollarSign, 
  MessageSquarePlus, 
  ShoppingBag, 
  UserPlus, 
  PlusCircle, 
  CalendarDays, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Receipt,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import { StatCard } from '../../components/common/StatCard';
import { formatBDT } from '../../services/calculations';

interface ManagerDashboardProps {
  onNavigate: (tab: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { 
    overallStats, 
    settings, 
    mealRequests, 
    transactions, 
    activityLogs, 
    responsibilities 
  } = useMess();

  const pendingRequests = mealRequests.filter(r => r.status === 'PENDING');
  const todayDuty = responsibilities.find(r => r.date === '2026-09-12');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Pending Meal Requests Prominent Alert Banner */}
      {pendingRequests.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          color: 'white',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MessageSquarePlus size={20} color="white" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                {pendingRequests.length} Pending Member Meal Request{pendingRequests.length > 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.95 }}>
                Members submitted meal extra/removal requests awaiting your review & approval.
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('requests')}
            className="btn"
            style={{ background: 'white', color: '#b45309', fontWeight: 800, fontSize: '0.85rem' }}
          >
            Review Requests <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Welcome Header */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f172a 100%)',
        color: 'white',
        padding: '24px',
        marginBottom: '20px',
        border: 'none',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'} 
              alt={currentUser?.name}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                objectFit: 'cover'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ color: 'white', fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', fontWeight: 800, margin: 0 }}>
                  Manager Console • {currentUser?.name}
                </h1>
                <span className="badge badge-success" style={{ background: '#10b981', color: 'white' }}>
                  Full Mess Control
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                {settings.messName} • {settings.address} • September 2026
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('members')}
              className="btn btn-sm"
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.25)' }}
            >
              <UserPlus size={14} /> Add Member
            </button>
            <button
              onClick={() => onNavigate('bazar')}
              className="btn btn-sm"
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.25)' }}
            >
              <ShoppingBag size={14} /> Add Bazar
            </button>
            <button
              onClick={() => onNavigate('finance')}
              className="btn btn-sm"
              style={{ background: '#10b981', color: 'white' }}
            >
              <PlusCircle size={14} /> Add Payment / Expense
            </button>
          </div>
        </div>
      </div>

      {/* Main Mess Stat Cards Grid */}
      <div className="grid-responsive-4">
        <StatCard
          label="Total Mess Treasury Balance"
          value={formatBDT(overallStats.currentMessBalance)}
          subtext={`Deposits: ${formatBDT(overallStats.totalFundDeposits)} | Expenses: ${formatBDT(overallStats.totalExpenses)}`}
          icon={Wallet}
          color="emerald"
          badgeText="Active Fund"
          badgeType="success"
          onClick={() => onNavigate('finance')}
        />

        <StatCard
          label="Dynamic Meal Rate"
          value={`৳${overallStats.currentMealRate.toFixed(2)}`}
          subtext={`Bazar: ${formatBDT(overallStats.totalBazarCost)} / ${overallStats.totalMealsConsumed} Meals`}
          icon={TrendingUp}
          color="amber"
          badgeText="Live Rate"
          badgeType="warning"
          onClick={() => onNavigate('meals')}
        />

        <StatCard
          label="Today's Meal Orders"
          value={`${overallStats.todayMealCount.total} Meals`}
          subtext={`Breakfast: ${overallStats.todayMealCount.breakfast} | Lunch: ${overallStats.todayMealCount.lunch} | Dinner: ${overallStats.todayMealCount.dinner}`}
          icon={UtensilsCrossed}
          color="blue"
          badgeText="Sept 12"
          badgeType="info"
          onClick={() => onNavigate('meals')}
        />

        <StatCard
          label="Active Mess Members"
          value={`${overallStats.activeMemberCount} Members`}
          subtext={`Total Dues: ${formatBDT(overallStats.totalDueAmount)} | Advances: ${formatBDT(overallStats.totalAdvanceAmount)}`}
          icon={Users}
          color="purple"
          badgeText="Managed"
          badgeType="purple"
          onClick={() => onNavigate('members')}
        />
      </div>

      {/* Quick Action Toolbar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Manager Quick Management Shortcuts
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          <button onClick={() => onNavigate('members')} className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
            <UserPlus size={16} color="var(--primary-600)" /> Manage Members
          </button>
          <button onClick={() => onNavigate('meals')} className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
            <UtensilsCrossed size={16} color="var(--info-600)" /> Update Meals
          </button>
          <button onClick={() => onNavigate('requests')} className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
            <MessageSquarePlus size={16} color="var(--accent-600)" /> Review Requests ({pendingRequests.length})
          </button>
          <button onClick={() => onNavigate('bazar')} className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
            <ShoppingBag size={16} color="var(--purple-600)" /> Record Bazar
          </button>
          <button onClick={() => onNavigate('finance')} className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
            <DollarSign size={16} color="var(--primary-600)" /> Record Payment
          </button>
          <button onClick={() => onNavigate('settings')} className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
            <Building size={16} color="var(--slate-600)" /> Mess Settings
          </button>
        </div>
      </div>

      {/* Split Rows: Recent Activity & Duty / Transactions */}
      <div className="grid-responsive-2">
        {/* Recent Financial Transactions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Receipt size={18} color="var(--primary-600)" />
              <span>Recent Payments & Expenses</span>
            </div>
            <button onClick={() => onNavigate('finance')} className="btn btn-outline btn-sm">
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transactions.slice(0, 5).map(tx => (
              <div 
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--slate-900)' }}>
                    {tx.memberName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {tx.date} • {tx.paymentMethod} {tx.trxId ? `(${tx.trxId})` : ''}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary-700)' }}>
                    +{formatBDT(tx.amount)}
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Mess Activity Logs */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={18} color="var(--primary-600)" />
              <span>Mess Activity Feed</span>
            </div>
            <button onClick={() => onNavigate('responsibilities')} className="btn btn-outline btn-sm">
              Duty Roster
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activityLogs.slice(0, 5).map(log => (
              <div 
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-500)', marginTop: '6px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                    <strong>{log.userName}</strong> {log.action}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {log.details}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '2px' }}>
                    {log.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
