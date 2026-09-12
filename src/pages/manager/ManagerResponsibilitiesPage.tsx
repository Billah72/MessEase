import React, { useState } from 'react';
import { 
  CalendarDays, 
  ShoppingBag, 
  ChefHat, 
  Sparkles, 
  Plus, 
  CheckCircle2 
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { ResponsibilityAssignment } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ManagerResponsibilitiesPage: React.FC = () => {
  const { responsibilities, saveResponsibility, users } = useMess();

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-09-13');
  const [bazarMembers, setBazarMembers] = useState<string[]>(['user-1', 'user-2']);
  const [cookingMembers, setCookingMembers] = useState<string[]>(['user-3']);
  const [cleaningMembers, setCleaningMembers] = useState<string[]>(['user-4', 'user-5']);
  const [shiftNote, setShiftNote] = useState('');

  const members = users.filter(u => u.role === 'MEMBER');

  const getUserNames = (ids: string[] = []) => {
    return ids.map(id => users.find(u => u.id === id)?.name || id).join(', ');
  };

  const handleSaveDuty = (e: React.FormEvent) => {
    e.preventDefault();
    saveResponsibility({
      id: `duty-${selectedDate}`,
      date: selectedDate,
      bazarDutyMemberIds: bazarMembers,
      cookingDutyMemberIds: cookingMembers,
      cleaningDutyMemberIds: cleaningMembers,
      shiftNote
    });
    setShowAssignModal(false);
  };

  return (
    <div className="page-content-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CalendarDays size={28} color="var(--primary-600)" />
            <span>Duty & Responsibility Assignments</span>
          </h1>
          <p className="page-subtitle">
            Manager rotation schedule for daily bazar shopping, cooking coordination, and flat cleaning
          </p>
        </div>

        <button 
          onClick={() => setShowAssignModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Assign Responsibilities
        </button>
      </div>

      {/* Roster Table */}
      <div className="card">
        <div className="table-responsive-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Bazar Duty (বাজার)</th>
                <th>Cooking Manager (রান্না)</th>
                <th>Cleaning Lead (পরিষ্কার)</th>
                <th>Shift Note</th>
              </tr>
            </thead>
            <tbody>
              {responsibilities.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>📅 {r.date}</div>
                    {r.date === '2026-09-12' && <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>TODAY</span>}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                      {getUserNames(r.bazarDutyMemberIds)}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                      {getUserNames(r.cookingDutyMemberIds)}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                      {getUserNames(r.cleaningDutyMemberIds)}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    {r.shiftNote || 'Standard duty'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Assign Duty */}
      {showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Assign Daily Duty Rotation"
          subtitle="Select date and on-duty members"
        >
          <form onSubmit={handleSaveDuty}>
            <div className="form-group">
              <label className="form-label">Duty Date</label>
              <input 
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bazar Duty Members</label>
              <select
                multiple
                value={bazarMembers}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions, o => o.value);
                  setBazarMembers(opts);
                }}
                className="form-control"
                style={{ height: '80px' }}
              >
                {members.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.roomNo})</option>
                ))}
              </select>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hold Ctrl/Cmd to select multiple</span>
            </div>

            <div className="grid-responsive-2" style={{ gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Cooking Lead</label>
                <select
                  value={cookingMembers[0] || members[0]?.id}
                  onChange={(e) => setCookingMembers([e.target.value])}
                  className="form-control"
                >
                  {members.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Cleaning Lead</label>
                <select
                  value={cleaningMembers[0] || members[0]?.id}
                  onChange={(e) => setCleaningMembers([e.target.value])}
                  className="form-control"
                >
                  {members.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Shift Note</label>
              <input 
                type="text"
                value={shiftNote}
                onChange={(e) => setShiftNote(e.target.value)}
                className="form-control"
                placeholder="e.g. Khichuri breakfast duty"
              />
            </div>

            <div className="modal-footer" style={{ padding: '16px 0 0 0', background: 'transparent' }}>
              <button type="button" onClick={() => setShowAssignModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <CheckCircle2 size={16} /> Save Responsibilities
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
