import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import { 
  Utensils, 
  Calendar, 
  Coffee, 
  Sun, 
  Moon, 
  PlusCircle, 
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

interface MemberMealsPageProps {
  onNavigateToRequests?: () => void;
}

export const MemberMealsPage: React.FC<MemberMealsPageProps> = ({ onNavigateToRequests }) => {
  const { currentUser } = useAuth();
  const { meals, mealInfos, overallStats } = useMess();

  const [selectedMonth, setSelectedMonth] = useState<string>('September 2026');

  // Filter records for this member
  const memberMeals = meals.filter(m => m.memberId === currentUser?.id);

  // Generate 13 days of September
  const days = Array.from({ length: 13 }, (_, i) => {
    const dayNum = String(i + 1).padStart(2, '0');
    const dateStr = `2026-09-${dayNum}`;
    const record = memberMeals.find(m => m.date === dateStr) || {
      breakfast: 1,
      lunch: 1,
      dinner: 1,
      guestMeals: 0
    };

    const bMenu = mealInfos.find(m => m.date === dateStr && m.mealType === 'BREAKFAST')?.menu || 'Roti & Dal';
    const lMenu = mealInfos.find(m => m.date === dateStr && m.mealType === 'LUNCH')?.menu || 'Rice & Fish Curry';
    const dMenu = mealInfos.find(m => m.date === dateStr && m.mealType === 'DINNER')?.menu || 'Rice & Chicken Curry';

    const dailyTotal = record.breakfast + record.lunch + record.dinner + record.guestMeals;

    return {
      day: i + 1,
      date: dateStr,
      record,
      dailyTotal,
      bMenu,
      lMenu,
      dMenu
    };
  });

  const totalMealsConsumed = days.reduce((sum, d) => sum + d.dailyTotal, 0);
  const totalRegularMeals = days.reduce((sum, d) => sum + (d.record.breakfast + d.record.lunch + d.record.dinner), 0);
  const totalGuestMeals = days.reduce((sum, d) => sum + d.record.guestMeals, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            My Daily Meal Log (আমার মিল হিসাব)
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Personal monthly meal log and daily dining menus for {selectedMonth}.
          </p>
        </div>

        {onNavigateToRequests && (
          <button
            onClick={onNavigateToRequests}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.875rem' }}
          >
            <PlusCircle size={16} />
            Submit Meal Change Request
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Consumed
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
            {totalMealsConsumed}
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>meals</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Regular: {totalRegularMeals} | Guest: {totalGuestMeals}
          </div>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Current Meal Rate
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            ৳{(overallStats.currentMealRate || 0).toFixed(2)}
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>/meal</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Live rate from total bazar expense
          </div>
        </div>

        <div className="card" style={{ padding: '18px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
            Est. Meal Cost
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            ৳{Math.round(totalMealsConsumed * (overallStats.currentMealRate || 0)).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Deducted from your mess deposit
          </div>
        </div>

      </div>

      {/* Daily Breakdown Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
            Day-by-Day Meal Matrix & Menus
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            1 - 13 September 2026
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Coffee size={14} color="#f59e0b" /> Breakfast
                  </div>
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Sun size={14} color="#3b82f6" /> Lunch
                  </div>
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Moon size={14} color="#8b5cf6" /> Dinner
                  </div>
                </th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Guest / Extra</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Day Total</th>
                <th style={{ padding: '12px 14px' }}>Daily Menu</th>
              </tr>
            </thead>
            <tbody>
              {days.map(d => {
                const isToday = d.date === '2026-09-12';
                return (
                  <tr 
                    key={d.date} 
                    style={{ 
                      borderBottom: '1px solid var(--border-light)',
                      background: isToday ? 'rgba(16,185,129,0.06)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{d.date}</span>
                        {isToday && (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--primary)', color: 'white', fontWeight: 700 }}>
                            TODAY
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Breakfast */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        background: d.record.breakfast > 0 ? '#ecfdf5' : '#fef2f2',
                        color: d.record.breakfast > 0 ? '#047857' : '#b91c1c'
                      }}>
                        {d.record.breakfast > 0 ? `${d.record.breakfast} on` : '0 off'}
                      </span>
                    </td>

                    {/* Lunch */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        background: d.record.lunch > 0 ? '#ecfdf5' : '#fef2f2',
                        color: d.record.lunch > 0 ? '#047857' : '#b91c1c'
                      }}>
                        {d.record.lunch > 0 ? `${d.record.lunch} on` : '0 off'}
                      </span>
                    </td>

                    {/* Dinner */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        background: d.record.dinner > 0 ? '#ecfdf5' : '#fef2f2',
                        color: d.record.dinner > 0 ? '#047857' : '#b91c1c'
                      }}>
                        {d.record.dinner > 0 ? `${d.record.dinner} on` : '0 off'}
                      </span>
                    </td>

                    {/* Guest Meals */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      {d.record.guestMeals > 0 ? (
                        <span style={{ padding: '3px 8px', borderRadius: '6px', background: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.8rem' }}>
                          +{d.record.guestMeals}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>0</span>
                      )}
                    </td>

                    {/* Day Total */}
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {d.dailyTotal}
                    </td>

                    {/* Daily Menu */}
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        🍳 {d.bMenu} | 🍲 {d.lMenu} | 🍗 {d.dMenu}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
