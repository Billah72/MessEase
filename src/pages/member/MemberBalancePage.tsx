import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Download,
  Info
} from 'lucide-react';

export const MemberBalancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { myFinancialSummary, transactions, overallStats } = useMess();

  // Filter transactions for this member
  const myTransactions = transactions.filter(t => t.memberId === currentUser?.id);

  const balance = myFinancialSummary?.balance ?? 0;
  const isPositive = balance >= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            My Balance & Financial Statement (আমার জমা-খরচ হিসাব)
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Complete breakdown of your deposits, meal cost deductions, and current net mess balance.
          </p>
        </div>
      </div>

      {/* Main Financial Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Net Balance Card */}
        <div className="card" style={{
          padding: '22px',
          borderLeft: `5px solid ${isPositive ? '#10b981' : '#ef4444'}`,
          background: isPositive ? 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, var(--bg-card) 100%)' : 'linear-gradient(135deg, rgba(239,68,68,0.05) 0%, var(--bg-card) 100%)'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Current Net Balance
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: isPositive ? '#10b981' : '#ef4444', marginTop: '6px' }}>
            ৳{Math.abs(balance).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isPositive ? '#047857' : '#b91c1c', marginTop: '4px' }}>
            {isPositive ? '✓ Surplus / Available Funds' : '⚠ Due Amount / ঋণ (Please deposit)'}
          </div>
        </div>

        {/* Total Deposited */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Total Cash Deposited
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            ৳{(myFinancialSummary?.totalDeposited || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Verified mess fund deposits
          </div>
        </div>

        {/* Total Meal Expense */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Meal Cost Deducted
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>
            ৳{Math.round(myFinancialSummary?.mealCost || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {myFinancialSummary?.totalMealsCount || 0} meals × ৳{(overallStats.currentMealRate || 0).toFixed(2)}
          </div>
        </div>

        {/* Utility / Shared Expense Share */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Shared Utility Share
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#8b5cf6', marginTop: '6px' }}>
            ৳{Math.round(myFinancialSummary?.sharedFixedCost || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Cook salary, gas, electricity, wifi
          </div>
        </div>

      </div>

      {/* Breakdown Notice */}
      <div style={{
        background: 'rgba(16,185,129,0.06)',
        border: '1px solid rgba(16,185,129,0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <Info size={24} color="#10b981" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong>Calculation Formula:</strong> <br />
          <code>Net Balance = (Total Deposited) - (Meals Consumed × Meal Rate) - (Shared Utility Bills)</code>
          <br />
          If you make a new payment via bKash, Nagad, or Cash to the Manager, the Manager will verify and update your deposit record.
        </div>
      </div>

      {/* Deposit Transaction History Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
              <Receipt size={20} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>My Deposit & Payment Receipts</h2>
          </div>
        </div>

        {myTransactions.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No deposit transactions found. Contact Manager to credit your initial deposit.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                  <th style={{ padding: '12px 14px' }}>Amount (৳)</th>
                  <th style={{ padding: '12px 14px' }}>Payment Method</th>
                  <th style={{ padding: '12px 14px' }}>Description / Note</th>
                  <th style={{ padding: '12px 14px' }}>Recorded By</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {myTransactions.map(tx => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{tx.date}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: '#10b981', fontSize: '0.95rem' }}>
                      +৳{tx.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'var(--bg-main)',
                        border: '1px solid var(--border-light)'
                      }}>
                        {tx.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>
                      {tx.description || 'Deposit to Mess Fund'}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {tx.recordedBy || 'Manager'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: '#dcfce7',
                        color: '#15803d'
                      }}>
                        <CheckCircle2 size={12} />
                        {tx.status}
                      </span>
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
