import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  CreditCard, 
  Utensils, 
  Radio, 
  AlertTriangle 
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { Announcement, AnnouncementCategory } from '../../types';
import { Modal } from '../../components/common/Modal';

export const ManagerAnnouncementsPage: React.FC = () => {
  const { announcements, createAnnouncement, deleteAnnouncement } = useMess();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('GENERAL');
  const [isImportant, setIsImportant] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    createAnnouncement({
      title,
      content,
      category,
      isImportant,
      isPinned,
      authorName: 'Sakib Hasan (Manager)'
    });
    setShowAddModal(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="page-content-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Megaphone size={28} color="var(--primary-600)" />
            <span>Mess Notice Board Management</span>
          </h1>
          <p className="page-subtitle">
            Publish announcements, payment reminders, and food cutoff notices to all members
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus size={16} /> Publish New Notice
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {announcements.map(ann => (
          <div 
            key={ann.id}
            className="card"
            style={{
              borderLeft: ann.isPinned ? '5px solid var(--primary-600)' : '1px solid var(--border-light)',
              background: ann.isPinned ? 'var(--primary-50)' : 'white'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                    {ann.title}
                  </h3>
                  {ann.isPinned && <span className="badge badge-success">PINNED</span>}
                  {ann.isImportant && <span className="badge badge-warning">IMPORTANT</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Posted by <strong>{ann.authorName}</strong> • {ann.createdAt}
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Delete this announcement?')) deleteAnnouncement(ann.id);
                }}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--danger-500)' }}
              >
                <Trash2 size={14} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--slate-800)', margin: '8px 0 0 0', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {ann.content}
            </p>
          </div>
        ))}
      </div>

      {/* Modal: Publish Announcement */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Publish Announcement to All Members"
          subtitle="All mess members will see this on their dashboard"
        >
          <form onSubmit={handlePost}>
            <div className="form-group">
              <label className="form-label">Notice Title</label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
                placeholder="e.g. 📢 September Deposit Reminder"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AnnouncementCategory)}
                className="form-control"
              >
                <option value="GENERAL">General Notice</option>
                <option value="PAYMENT">Payment Reminder</option>
                <option value="FOOD">Food & Menu Update</option>
                <option value="BAZAR">Bazar Shopping</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea 
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-control"
                placeholder="Write message for all members..."
              />
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                />
                Pin to top
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                />
                Mark important
              </label>
            </div>

            <div className="modal-footer" style={{ padding: '16px 0 0 0', background: 'transparent' }}>
              <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <CheckCircle2 size={16} /> Publish Notice
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
