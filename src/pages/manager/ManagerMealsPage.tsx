import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Calendar, 
  Plus, 
  Minus, 
  Save, 
  FileSpreadsheet, 
  Sun, 
  Moon, 
  Coffee, 
  Check, 
  Edit3, 
  Users 
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { MealRecord, MealInfo, MealType } from '../../types';
import { calculateMemberMealsCount } from '../../services/calculations';
import { Modal } from '../../components/common/Modal';

export const ManagerMealsPage: React.FC = () => {
  const { users, meals, mealInfos, updateMealRecord, updateMealInfo, settings } = useMess();

  const [selectedDate, setSelectedDate] = useState('2026-09-12');
  const [viewMode, setViewMode] = useState<'DAILY' | 'MONTHLY_MATRIX'>('DAILY');
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Menu editor state
  const [editMealType, setEditMealType] = useState<MealType>('LUNCH');
  const [editMenuText, setEditMenuText] = useState('Katla Fish Curry, Dal, Potol Bhaji & Rice');
  const [editNotes, setEditNotes] = useState('');

  const members = users.filter(u => u.role === 'MEMBER');

  const daysInMonth = Array.from({ length: 13 }, (_, i) => {
    const d = String(i + 1).padStart(2, '0');
    return `2026-09-${d}`;
  });

  const getMemberMeal = (memberId: string): MealRecord => {
    const found = meals.find(m => m.memberId === memberId && m.date === selectedDate);
    if (found) return found;
    const u = users.find(user => user.id === memberId);
    return {
      id: `meal-${memberId}-${selectedDate}`,
      date: selectedDate,
      memberId,
      memberName: u?.name || 'Member',
      breakfast: 1,
      lunch: 1,
      dinner: 1,
      guestMeals: 0,
      updatedAt: ''
    };
  };

  const handleMealChange = (memberId: string, field: 'breakfast' | 'lunch' | 'dinner' | 'guestMeals', delta: number) => {
    const current = getMemberMeal(memberId);
    const newVal = Math.max(0, (current[field] || 0) + delta);
    updateMealRecord({
      memberId,
      date: selectedDate,
      [field]: newVal
    });
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    updateMealInfo({
      date: selectedDate,
      mealType: editMealType,
      menu: editMenuText,
      expectedMealCount: members.length,
      actualMealCount: members.length,
      notes: editNotes
    });
    setShowMenuModal(false);
    setSaveSuccessMsg(`Updated ${editMealType} menu for ${selectedDate}!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Day calculations
  const dayRecords = members.map(m => getMemberMeal(m.id));
  const totalB = dayRecords.reduce((s, r) => s + (r.breakfast || 0), 0);
  const totalL = dayRecords.reduce((s, r) => s + (r.lunch || 0), 0);
  const totalD = dayRecords.reduce((s, r) => s + (r.dinner || 0), 0);
  const totalG = dayRecords.reduce((s, r) => s + (r.guestMeals || 0), 0);
  const dayWeightedTotal = (totalB * settings.breakfastCostRatio) + (totalL * settings.lunchCostRatio) + (totalD * settings.dinnerCostRatio) + totalG;

  const currentMenus = mealInfos.filter(m => m.date === selectedDate);

  return (
    <div className="page-content">
      {saveSuccessMsg && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          background: 'var(--slate-900)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderLeft: '4px solid #10b981',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <Check size={18} color="#34d399" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UtensilsCrossed size={28} color="var(--primary-600)" />
            <span>Manager Meal Control Sheet</span>
          </h1>
          <p className="page-subtitle">
            Daily meal counts, menus, guest meals, and monthly matrix grid for all members
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowMenuModal(true)}
            className="btn btn-secondary btn-sm"
          >
            <Edit3 size={15} /> Set Today's Menu
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'DAILY' ? 'MONTHLY_MATRIX' : 'DAILY')}
            className="btn btn-primary btn-sm"
          >
            {viewMode === 'DAILY' ? <FileSpreadsheet size={15} /> : <Calendar size={15} />}
            {viewMode === 'DAILY' ? 'Monthly Matrix Grid' : 'Daily Entry Sheet'}
          </button>
        </div>
      </div>

      {viewMode === 'DAILY' ? (
        <>
          {/* Date Selector & Day Totals Bar */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-control"
                  style={{ width: 'auto', fontWeight: 700 }}
                />
                <button 
                  onClick={() => setSelectedDate('2026-09-12')}
                  className="btn btn-outline btn-sm"
                >
                  Today
                </button>
                <button 
                  onClick={() => setSelectedDate('2026-09-13')}
                  className="btn btn-outline btn-sm"
                >
                  Tomorrow
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary-50)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
                  <Coffee size={15} color="var(--primary-700)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-800)' }}>Breakfast: <strong>{totalB}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--info-50)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
                  <Sun size={15} color="var(--info-700)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--info-800)' }}>Lunch: <strong>{totalL}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--purple-50)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
                  <Moon size={15} color="var(--purple-700)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--purple-800)' }}>Dinner: <strong>{totalD}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--slate-100)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    Total: {dayWeightedTotal.toFixed(1)} Meals
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menus of the Day Display */}
          {currentMenus.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              {currentMenus.map(menu => (
                <div key={menu.mealType} className="card" style={{ padding: '14px', background: 'var(--slate-50)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>{menu.mealType} MENU</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--slate-900)' }}>
                    {menu.menu}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Daily Table for Members */}
          <div className="table-responsive" style={{ marginBottom: '24px' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Room</th>
                  <th style={{ textAlign: 'center' }}>Breakfast (0.5)</th>
                  <th style={{ textAlign: 'center' }}>Lunch (1.0)</th>
                  <th style={{ textAlign: 'center' }}>Dinner (1.0)</th>
                  <th style={{ textAlign: 'center' }}>Guest Extra Meals</th>
                  <th style={{ textAlign: 'right' }}>Day Weighted Total</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => {
                  const rec = getMemberMeal(member.id);
                  const memberWeighted = calculateMemberMealsCount(rec, settings);

                  return (
                    <tr key={member.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={member.avatarUrl} 
                            alt={member.name}
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{member.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{member.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-slate">{member.roomNo}</span>
                      </td>

                      {/* Breakfast Stepper */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleMealChange(member.id, 'breakfast', -0.5)}
                            className="btn btn-secondary btn-icon-only"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                            {rec.breakfast}
                          </span>
                          <button
                            onClick={() => handleMealChange(member.id, 'breakfast', 0.5)}
                            className="btn btn-secondary btn-icon-only"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Lunch Stepper */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleMealChange(member.id, 'lunch', -1)}
                            className="btn btn-secondary btn-icon-only"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                            {rec.lunch}
                          </span>
                          <button
                            onClick={() => handleMealChange(member.id, 'lunch', 1)}
                            className="btn btn-secondary btn-icon-only"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Dinner Stepper */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleMealChange(member.id, 'dinner', -1)}
                            className="btn btn-secondary btn-icon-only"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                            {rec.dinner}
                          </span>
                          <button
                            onClick={() => handleMealChange(member.id, 'dinner', 1)}
                            className="btn btn-secondary btn-icon-only"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Guest Meals Stepper */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => handleMealChange(member.id, 'guestMeals', -1)}
                            className="btn btn-secondary btn-icon-only"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center', color: rec.guestMeals > 0 ? 'var(--primary-700)' : 'var(--slate-800)' }}>
                            {rec.guestMeals}
                          </span>
                          <button
                            onClick={() => handleMealChange(member.id, 'guestMeals', 1)}
                            className="btn btn-secondary btn-icon-only"
                            style={{ width: '28px', height: '28px', padding: 0 }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </td>

                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-700)', fontSize: '0.95rem' }}>
                        {memberWeighted.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Monthly Matrix Grid */
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <FileSpreadsheet size={20} color="var(--primary-600)" />
              <span>September 2026 - Monthly Meal Matrix Sheet</span>
            </div>
          </div>

          <div className="table-responsive" style={{ maxHeight: '550px' }}>
            <table className="custom-table" style={{ fontSize: '0.78rem' }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', left: 0, background: 'var(--slate-100)', zIndex: 10 }}>Member Name</th>
                  {daysInMonth.map(d => (
                    <th key={d} style={{ textAlign: 'center', minWidth: '40px', padding: '8px 4px' }}>
                      {d.split('-')[2]}
                    </th>
                  ))}
                  <th style={{ textAlign: 'right', background: 'var(--slate-100)', position: 'sticky', right: 0, zIndex: 10 }}>
                    Total Meals
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map(u => {
                  let sum = 0;
                  return (
                    <tr key={u.id}>
                      <td style={{ position: 'sticky', left: 0, background: 'white', zIndex: 5, fontWeight: 700 }}>
                        {u.name.split(' ')[0]} ({u.roomNo})
                      </td>
                      {daysInMonth.map(d => {
                        const rec = meals.find(m => m.memberId === u.id && m.date === d);
                        const weighted = rec ? calculateMemberMealsCount(rec, settings) : 0;
                        sum += weighted;
                        return (
                          <td key={d} style={{ textAlign: 'center', padding: '6px 2px' }}>
                            {weighted > 0 ? weighted.toFixed(1) : '-'}
                          </td>
                        );
                      })}
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-700)', position: 'sticky', right: 0, background: 'white', zIndex: 5 }}>
                        {sum.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Set Menu */}
      {showMenuModal && (
        <Modal
          isOpen={showMenuModal}
          onClose={() => setShowMenuModal(false)}
          title="Set Meal Menu & Instructions"
          subtitle={`Date: ${selectedDate}`}
        >
          <form onSubmit={handleSaveMenu}>
            <div className="form-group">
              <label className="form-label">Meal Type</label>
              <select
                value={editMealType}
                onChange={(e) => setEditMealType(e.target.value as MealType)}
                className="form-control"
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Menu Description</label>
              <input 
                type="text"
                required
                value={editMenuText}
                onChange={(e) => setEditMenuText(e.target.value)}
                className="form-control"
                placeholder="e.g. Sonali Chicken Bhuna, Dal, Salad & Rice"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes & Cooking Guidelines</label>
              <input 
                type="text"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="form-control"
                placeholder="e.g. Serve hot by 9:30 PM"
              />
            </div>

            <div className="modal-footer" style={{ padding: '16px 0 0 0', background: 'transparent' }}>
              <button type="button" onClick={() => setShowMenuModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={16} /> Save Menu
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
