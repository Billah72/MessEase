import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import { 
  Sparkles, 
  ShoppingBag, 
  Flame, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';

export const MemberResponsibilitiesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { responsibilities, users } = useMess();

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || id;

  const todayStr = '2026-09-12';

  return (
    <div className="page-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          Mess Duty & Rotation Schedule (দায়িত্ব বণ্টন)
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
          Check assigned daily duties for grocery bazar, cooking assistance, and dining cleanliness.
        </p>
      </div>

      {/* Duty Guidelines Banner */}
      <div className="grid-responsive-3" style={{ gap: '16px' }}>
        
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #2563eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ background: '#eff6ff', color: '#2563eb', padding: '8px', borderRadius: '10px' }}>
              <ShoppingBag size={20} />
            </div>
            <strong style={{ fontSize: '1rem', color: '#1e40af' }}>Bazar Duty (বাজারের দায়িত্ব)</strong>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Go to Kawran Bazar/Local Market by 7:30 AM. Collect cash slip from the manager and return itemized receipt with leftover balance.
          </p>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #ea580c' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ background: '#fff7ed', color: '#ea580c', padding: '8px', borderRadius: '10px' }}>
              <Flame size={20} />
            </div>
            <strong style={{ fontSize: '1rem', color: '#9a3412' }}>Cooking Support (রান্না সহায়তা)</strong>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Assist the mess cook with vegetable cutting, checking spice supplies, and meal dish serving for lunch and dinner.
          </p>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ background: '#f0fdf4', color: '#16a34a', padding: '8px', borderRadius: '10px' }}>
              <Sparkles size={20} />
            </div>
            <strong style={{ fontSize: '1rem', color: '#166534' }}>Dining & Cleanliness (পরিচ্ছন্নতা)</strong>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            Ensure clean drinking water filter jars are full, dining table wiped clean, and handwash liquid refilled.
          </p>
        </div>

      </div>

      {/* Roster Table */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
            September 2026 Duty Schedule
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manager Assigned Schedule
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {responsibilities.map(r => {
            const isToday = r.date === todayStr;
            const isMyDuty = r.bazarDutyMemberIds.includes(currentUser?.id || '') ||
                             r.cookingDutyMemberIds.includes(currentUser?.id || '') ||
                             r.cleaningDutyMemberIds.includes(currentUser?.id || '');

            return (
              <div
                key={r.date}
                style={{
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-md)',
                  background: isToday ? 'rgba(16,185,129,0.06)' : 'var(--bg-main)',
                  border: `1px solid ${isToday ? '#10b981' : isMyDuty ? '#93c5fd' : 'var(--border-light)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={18} color="var(--primary)" />
                    <strong style={{ fontSize: '0.95rem' }}>{r.date}</strong>
                    {isToday && (
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'var(--primary)', color: 'white', fontWeight: 700 }}>
                        TODAY
                      </span>
                    )}
                  </div>

                  {isMyDuty && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: '#dbeafe',
                      color: '#1e40af'
                    }}>
                      <UserCheck size={12} />
                      Your Assigned Day
                    </span>
                  )}
                </div>

                <div className="grid-responsive-3" style={{ gap: '12px' }}>
                  
                  {/* Bazar Duty */}
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>
                      🛒 Bazar Duty (বাজার):
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {r.bazarDutyMemberIds.map(id => getUserName(id)).join(', ') || 'None assigned'}
                    </div>
                  </div>

                  {/* Cooking Duty */}
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c', marginBottom: '4px' }}>
                      🍳 Cooking Support (রান্না):
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {r.cookingDutyMemberIds.map(id => getUserName(id)).join(', ') || 'None assigned'}
                    </div>
                  </div>

                  {/* Cleaning Duty */}
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', marginBottom: '4px' }}>
                      ✨ Cleaning & Water (পরিচ্ছন্নতা):
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {r.cleaningDutyMemberIds.map(id => getUserName(id)).join(', ') || 'None assigned'}
                    </div>
                  </div>

                </div>

                {r.shiftNote && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Note: {r.shiftNote}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
