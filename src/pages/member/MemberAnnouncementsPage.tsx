import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import { 
  Bell, 
  Search, 
  Pin, 
  AlertTriangle, 
  Info, 
  Calendar,
  Sparkles
} from 'lucide-react';

export const MemberAnnouncementsPage: React.FC = () => {
  const { announcements } = useMess();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = announcements.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Mess Notice Board (নোটিশ বোর্ড)
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
            Official announcements, rules, utility bill notices, and feast updates from the Manager.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 'min(100%, 280px)' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Announcements List */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Info size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <div>No announcements found matching "{searchTerm}".</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map(notice => {
            const isUrgent = !!notice.isImportant;
            return (
              <div 
                key={notice.id} 
                className="card"
                style={{ 
                  padding: '24px',
                  borderLeft: isUrgent ? '5px solid #ef4444' : notice.isPinned ? '5px solid var(--primary)' : '1px solid var(--border-light)',
                  background: isUrgent ? 'linear-gradient(135deg, rgba(239,68,68,0.03) 0%, var(--bg-card) 100%)' : 'var(--bg-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {notice.isPinned && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <Pin size={12} /> PINNED
                      </span>
                    )}
                    {isUrgent && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        <AlertTriangle size={12} /> URGENT
                      </span>
                    )}
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>
                      {notice.title}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} />
                    <span>{notice.createdAt}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px 0', whiteSpace: 'pre-line' }}>
                  {notice.content}
                </p>

                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Posted by: <strong>{notice.authorName || 'Manager'}</strong></span>
                  <span>Mess Notice</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
