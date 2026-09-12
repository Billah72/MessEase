import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Building, 
  Calculator, 
  ShieldAlert, 
  Download, 
  RotateCcw, 
  CheckCircle2 
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { MessSettings } from '../../types';

export const ManagerSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllToDemo, exportBackup } = useMess();

  const [formData, setFormData] = useState<MessSettings>({ ...settings });
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${settings.messName}_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-content">
      {saveToast && (
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
          <CheckCircle2 size={18} color="#34d399" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Mess settings updated successfully!</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Settings size={28} color="var(--primary-600)" />
            <span>Mess Settings & Configuration</span>
          </h1>
          <p className="page-subtitle">
            Only the Manager can configure mess profile, meal pricing ratios, and data backups
          </p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid-2" style={{ marginBottom: '24px' }}>
          {/* General Details */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Building size={18} color="var(--primary-600)" />
                <span>Mess Profile & Details</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mess Name</label>
              <input 
                type="text"
                value={formData.messName}
                onChange={(e) => setFormData({ ...formData, messName: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input 
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number</label>
              <input 
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description & Notice</label>
              <textarea 
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="form-control"
              />
            </div>
          </div>

          {/* Meal Calculation Formulas */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <Calculator size={18} color="var(--primary-600)" />
                <span>Meal Pricing Ratios</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div className="form-group">
                <label className="form-label">Breakfast Ratio</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={formData.breakfastCostRatio}
                  onChange={(e) => setFormData({ ...formData, breakfastCostRatio: Number(e.target.value) })}
                  className="form-control"
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Default: 0.5</span>
              </div>

              <div className="form-group">
                <label className="form-label">Lunch Ratio</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={formData.lunchCostRatio}
                  onChange={(e) => setFormData({ ...formData, lunchCostRatio: Number(e.target.value) })}
                  className="form-control"
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Default: 1.0</span>
              </div>

              <div className="form-group">
                <label className="form-label">Dinner Ratio</label>
                <input 
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  value={formData.dinnerCostRatio}
                  onChange={(e) => setFormData({ ...formData, dinnerCostRatio: Number(e.target.value) })}
                  className="form-control"
                  required
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Default: 1.0</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Utility Fee per Member (৳)</label>
              <input 
                type="number"
                value={formData.fixedCostPerMember}
                onChange={(e) => setFormData({ ...formData, fixedCostPerMember: Number(e.target.value) })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Meal Schedule & Rules</label>
              <input 
                type="text"
                value={formData.mealScheduleNotes}
                onChange={(e) => setFormData({ ...formData, mealScheduleNotes: e.target.value })}
                className="form-control"
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            <Save size={18} /> Save Mess Settings
          </button>
        </div>
      </form>

      {/* Backup & System Reset */}
      <div className="card" style={{ borderTop: '4px solid var(--danger-500)' }}>
        <div className="card-header">
          <div className="card-title">
            <ShieldAlert size={18} color="var(--danger-500)" />
            <span>Database Backup & Factory Reset</span>
          </div>
        </div>

        <div className="grid-2" style={{ gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
              Export Mess Database
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Download a complete JSON backup of all members, meals, requests, and transactions.
            </p>
            <button onClick={handleDownloadBackup} className="btn btn-secondary btn-sm">
              <Download size={14} /> Download JSON Backup
            </button>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px' }}>
              Reset to Demo Data
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Restore original 1 Manager, 6 Members, and realistic Dhaka mess dataset.
            </p>
            <button 
              onClick={() => {
                if (confirm('Reset all data to default demo state?')) resetAllToDemo();
              }} 
              className="btn btn-danger btn-sm"
            >
              <RotateCcw size={14} /> Reset Demo Dataset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
