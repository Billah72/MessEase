import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMess } from '../../context/MessContext';
import type { MealType, MealRequestType } from '../../types';
import { 
  Send, 
  PlusCircle, 
  MinusCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Info, 
  Filter,
  Utensils
} from 'lucide-react';

export const MemberMealRequestsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { myMealRequests, submitMealRequest } = useMess();

  // Form states
  const [requestType, setRequestType] = useState<MealRequestType>('EXTRA_MEAL');
  const [date, setDate] = useState<string>('2026-09-13');
  const [mealType, setMealType] = useState<MealType>('LUNCH');
  const [extraCount, setExtraCount] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    submitMealRequest({
      memberId: currentUser.id,
      memberName: currentUser.name,
      memberEmail: currentUser.email,
      memberAvatar: currentUser.avatarUrl,
      date,
      mealType,
      requestType,
      extraCount: requestType === 'EXTRA_MEAL' ? extraCount : 0,
      reason: reason.trim() || (requestType === 'EXTRA_MEAL' ? `Extra ${mealType}` : `Turn off ${mealType}`)
    });

    setReason('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const filteredRequests = myMealRequests.filter(req => {
    if (filterStatus === 'ALL') return true;
    return req.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Meal Requests & Changes (মিল রিকোয়েস্ট ও পরিবর্তন)
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Submit extra guest meal orders or meal off requests. The Manager reviews and approves all requests.
          </p>
        </div>
      </div>

      {showSuccessToast && (
        <div style={{
          padding: '14px 18px',
          background: '#ecfdf5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} color="#10b981" />
          <span>Your request has been submitted to the Manager. You'll be notified when it's approved!</span>
        </div>
      )}

      {/* Top Banner Notice */}
      <div style={{
        background: 'rgba(59,130,246,0.08)',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <Info size={24} color="#3b82f6" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.5 }}>
          <strong>Meal Timing Guidelines:</strong> Breakfast off requests must be submitted before <strong>9:00 PM</strong> the night before. Lunch off requests before <strong>8:00 AM</strong> and Dinner off requests before <strong>3:00 PM</strong> on the same day.
        </div>
      </div>

      {/* Main Content Grid: Request Form + History Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        
        {/* Submit Form Card */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
              <Send size={20} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Submit a New Request</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Request Type Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Request Type (অনুরোধের ধরন)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRequestType('EXTRA_MEAL')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: requestType === 'EXTRA_MEAL' ? '2px solid #10b981' : '1px solid var(--border-light)',
                    background: requestType === 'EXTRA_MEAL' ? '#ecfdf5' : 'var(--bg-main)',
                    color: requestType === 'EXTRA_MEAL' ? '#047857' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <PlusCircle size={18} color="#10b981" />
                  <span>Extra Meal (গেস্ট / অতিরিক্ত)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('MEAL_REMOVAL')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: requestType === 'MEAL_REMOVAL' ? '2px solid #ef4444' : '1px solid var(--border-light)',
                    background: requestType === 'MEAL_REMOVAL' ? '#fef2f2' : 'var(--bg-main)',
                    color: requestType === 'MEAL_REMOVAL' ? '#b91c1c' : 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <MinusCircle size={18} color="#ef4444" />
                  <span>Meal Off (মিল বন্ধ / বাদ)</span>
                </button>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Select Target Date (তারিখ)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control"
                  required
                  style={{ padding: '10px 14px' }}
                />
              </div>
            </div>

            {/* Meal Type (Breakfast, Lunch, Dinner) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Meal Type (কোন বেলার খাবার)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {(['BREAKFAST', 'LUNCH', 'DINNER'] as MealType[]).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMealType(type)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: mealType === type ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                      background: mealType === type ? 'var(--primary-light)' : 'var(--bg-main)',
                      color: mealType === type ? 'var(--primary)' : 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {type === 'BREAKFAST' && 'Breakfast (সকাল)'}
                    {type === 'LUNCH' && 'Lunch (দুপুর)'}
                    {type === 'DINNER' && 'Dinner (রাত)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Count Stepper (If Extra Meal) */}
            {requestType === 'EXTRA_MEAL' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Extra Guests / Count (কতটি মিল)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setExtraCount(Math.max(1, extraCount - 1))}
                    style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-card)', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    -
                  </button>
                  <div style={{ minWidth: '60px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                    +{extraCount}
                  </div>
                  <button
                    type="button"
                    onClick={() => setExtraCount(extraCount + 1)}
                    style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'var(--bg-card)', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    +
                  </button>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ({extraCount} extra {mealType.toLowerCase()} meals)
                  </span>
                </div>
              </div>
            )}

            {/* Reason / Notes */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Note / Reason (কারণ বা বিবরণ - ঐচ্ছিক)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={requestType === 'EXTRA_MEAL' ? 'e.g. University friend coming over for dinner' : 'e.g. Going to village for weekend'}
                rows={2}
                className="form-control"
                style={{ padding: '10px 14px', resize: 'vertical' }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '12px', fontSize: '0.95rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '6px' }}
            >
              <Send size={18} />
              Submit Request to Manager
            </button>

          </form>
        </div>

        {/* My Request History Card */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#ede9fe', color: '#7c3aed', padding: '8px', borderRadius: '10px' }}>
                <Clock size={20} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>My Submission History</h2>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              {['ALL', 'PENDING', 'APPROVED', 'DECLINED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: filterStatus === status ? 'var(--primary)' : 'transparent',
                    color: filterStatus === status ? 'white' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', color: 'var(--text-muted)', textAlign: 'center' }}>
              <Utensils size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No requests found in this filter.</div>
              <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Fill out the form on the left to submit a meal request.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '550px', paddingRight: '4px' }}>
              {filteredRequests.map(req => (
                <div
                  key={req.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-main)',
                    border: `1px solid ${
                      req.status === 'APPROVED' ? '#86efac' :
                      req.status === 'PENDING' ? '#fde047' : '#fca5a5'
                    }`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: req.requestType === 'EXTRA_MEAL' ? '#eff6ff' : '#fef2f2',
                          color: req.requestType === 'EXTRA_MEAL' ? '#2563eb' : '#dc2626'
                        }}>
                          {req.requestType === 'EXTRA_MEAL' ? `+${req.extraCount || 1} Extra ${req.mealType}` : `Turn Off ${req.mealType}`}
                        </span>
                        <strong style={{ fontSize: '0.9rem' }}>{req.date}</strong>
                      </div>
                      {req.reason && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          "{req.reason}"
                        </div>
                      )}
                    </div>

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
                  </div>

                  {/* Manager Response Note */}
                  <div style={{ paddingTop: '8px', borderTop: '1px dashed var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Submitted: {req.submittedAt}</span>
                    <span>
                      {req.status === 'APPROVED' && <strong style={{ color: '#15803d' }}>Auto-synced into meal records ✓</strong>}
                      {req.status === 'DECLINED' && <strong style={{ color: '#b91c1c' }}>{req.responseNote || 'Declined'}</strong>}
                      {req.status === 'PENDING' && <span style={{ color: '#d97706' }}>Awaiting Manager action</span>}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
