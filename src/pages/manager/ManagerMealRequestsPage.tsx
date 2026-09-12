import React, { useState } from 'react';
import { 
  MessageSquarePlus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  User, 
  Sparkles, 
  Plus, 
  Filter, 
  Search,
  Check
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { MealRequest, RequestStatus } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ManagerMealRequestsPage: React.FC = () => {
  const { mealRequests, reviewMealRequest } = useMess();

  const [selectedRequest, setSelectedRequest] = useState<MealRequest | null>(null);
  const [responseNote, setResponseNote] = useState('');
  const [actionType, setActionType] = useState<'APPROVE' | 'DECLINE'>('APPROVE');
  const [filterStatus, setFilterStatus] = useState<string>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleOpenActionModal = (req: MealRequest, action: 'APPROVE' | 'DECLINE') => {
    setSelectedRequest(req);
    setActionType(action);
    setResponseNote(action === 'APPROVE' ? `Approved by Manager. Meal count automatically updated.` : 'Declined by Manager.');
  };

  const handleConfirmAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const status: RequestStatus = actionType === 'APPROVE' ? 'APPROVED' : 'DECLINED';
    reviewMealRequest(selectedRequest.id, status, responseNote);

    setSuccessToast(`Successfully ${status.toLowerCase()} request from ${selectedRequest.memberName}! Meal records updated.`);
    setTimeout(() => setSuccessToast(null), 3500);

    setSelectedRequest(null);
    setResponseNote('');
  };

  const filtered = mealRequests.filter(r => {
    const matchesSearch = r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.mealType.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && r.status === filterStatus;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'APPROVED': return <span className="badge badge-success">Approved & Synced</span>;
      case 'DECLINED': return <span className="badge badge-danger">Declined</span>;
      default: return <span className="badge badge-warning">Pending Review</span>;
    }
  };

  return (
    <div className="page-content">
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          background: 'var(--slate-900)',
          color: 'white',
          padding: '14px 22px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: '4px solid #10b981',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={20} color="#34d399" />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <MessageSquarePlus size={28} color="var(--primary-600)" />
            <span>Member Meal Requests Inbox</span>
          </h1>
          <p className="page-subtitle">
            Review, approve or decline Extra Meal and Meal Removal requests with automated meal count updating
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text"
              placeholder="Search by member name, meal type, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['PENDING', 'APPROVED', 'DECLINED', 'ALL'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.78rem' }}
              >
                {st} ({mealRequests.filter(r => st === 'ALL' || r.status === st).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Requests Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <MessageSquarePlus size={28} />
            </div>
            <div className="empty-state-title">No Requests Found</div>
            <div className="empty-state-text">
              There are no meal requests matching the selected filter.
            </div>
          </div>
        ) : (
          filtered.map(req => (
            <div 
              key={req.id} 
              className="card"
              style={{
                borderLeft: req.status === 'PENDING' ? '5px solid var(--accent-500)' :
                            req.status === 'APPROVED' ? '5px solid var(--primary-600)' : '5px solid var(--danger-500)',
                background: req.status === 'PENDING' ? 'var(--accent-50)' : 'white'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={req.memberAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                    alt={req.memberName} 
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                        {req.memberName}
                      </h3>
                      {getStatusBadge(req.status)}
                      <span className={`badge ${req.requestType === 'EXTRA_MEAL' ? 'badge-purple' : 'badge-info'}`}>
                        {req.requestType === 'EXTRA_MEAL' ? `+${req.extraCount} Extra Meal` : 'Meal Removal (Off)'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {req.memberEmail} • Submitted: {req.submittedAt}
                    </div>
                  </div>
                </div>

                {req.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenActionModal(req, 'APPROVE')}
                      className="btn btn-primary btn-sm"
                      style={{ fontWeight: 700 }}
                    >
                      <CheckCircle2 size={16} /> Approve & Auto-Sync
                    </button>
                    <button
                      onClick={() => handleOpenActionModal(req, 'DECLINE')}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={16} /> Decline
                    </button>
                  </div>
                )}
              </div>

              {/* Request Details Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                fontSize: '0.875rem'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Date:</span>
                    <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>📅 {req.date}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Meal Type:</span>
                    <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>🍽️ {req.mealType}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reason:</span>
                    <div style={{ fontWeight: 600, color: 'var(--slate-800)' }}>"{req.reason}"</div>
                  </div>
                </div>

                {req.note && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--border-subtle)', paddingTop: '6px' }}>
                    Note: {req.note}
                  </div>
                )}
              </div>

              {/* Manager Response Note */}
              {req.responseNote && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  background: req.status === 'APPROVED' ? 'var(--primary-50)' : 'var(--danger-50)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: req.status === 'APPROVED' ? 'var(--primary-900)' : 'var(--danger-900)'
                }}>
                  <strong>Manager Response ({req.reviewedBy}):</strong> {req.responseNote}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Action Review Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={`${actionType === 'APPROVE' ? 'Approve' : 'Decline'} Meal Request`}
          subtitle={`Member: ${selectedRequest.memberName} • ${selectedRequest.mealType} on ${selectedRequest.date}`}
        >
          <form onSubmit={handleConfirmAction}>
            <div style={{
              background: actionType === 'APPROVE' ? 'var(--primary-50)' : 'var(--danger-50)',
              border: `1px solid ${actionType === 'APPROVE' ? 'var(--primary-200)' : 'var(--danger-200)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '16px',
              fontSize: '0.85rem'
            }}>
              <div style={{ fontWeight: 700, color: actionType === 'APPROVE' ? 'var(--primary-900)' : 'var(--danger-900)', marginBottom: '4px' }}>
                {actionType === 'APPROVE' ? '✅ Automatic Meal Count Synchronization' : '❌ Request Decline'}
              </div>
              <p style={{ margin: 0, color: actionType === 'APPROVE' ? 'var(--primary-800)' : 'var(--danger-800)' }}>
                {actionType === 'APPROVE'
                  ? selectedRequest.requestType === 'EXTRA_MEAL'
                    ? `Approving will automatically add +${selectedRequest.extraCount} guest meal to ${selectedRequest.memberName}'s record for ${selectedRequest.date}.`
                    : `Approving will automatically turn OFF ${selectedRequest.mealType} (0 meals) for ${selectedRequest.memberName} on ${selectedRequest.date}.`
                  : 'Declining will keep the member\'s regular meal count unchanged.'}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Manager Response / Feedback to Member</label>
              <input 
                type="text"
                required
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                className="form-control"
              />
            </div>

            <div className="modal-footer" style={{ padding: '16px 0 0 0', background: 'transparent' }}>
              <button type="button" onClick={() => setSelectedRequest(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn ${actionType === 'APPROVE' ? 'btn-primary' : 'btn-danger'}`}
              >
                Confirm {actionType === 'APPROVE' ? 'Approval & Sync' : 'Decline'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
