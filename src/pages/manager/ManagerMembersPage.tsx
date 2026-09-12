import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  Lock, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Key, 
  Copy, 
  DollarSign, 
  Search,
  Check
} from 'lucide-react';
import { useMess } from '../../context/MessContext';
import { User } from '../../types';
import { Modal } from '../../components/common/Modal';
import { formatBDT } from '../../services/calculations';

export const ManagerMembersPage: React.FC = () => {
  const { users, memberSummaries, createMemberAccount, updateMemberAccount, toggleMemberStatus } = useMess();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ name: string; email: string; pass: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states for creating member
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('member123');
  const [roomNo, setRoomNo] = useState('Room 402');
  const [initialDeposit, setInitialDeposit] = useState<number>(5000);

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newM = createMemberAccount({
      name,
      email,
      phone,
      password,
      roomNo,
      initialDeposit
    });

    setCreatedCredentials({
      name: newM.name,
      email: newM.email,
      pass: password
    });

    setShowCreateModal(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const handleEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    updateMemberAccount(editingMember.id, {
      name: editingMember.name,
      phone: editingMember.phone,
      roomNo: editingMember.roomNo,
      password: editingMember.password
    });
    setEditingMember(null);
  };

  const members = users.filter(u => u.role === 'MEMBER');
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.roomNo && m.roomNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `Green View Mess Member Login:\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.pass}\nLogin URL: http://localhost:5173/`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={28} color="var(--primary-600)" />
            <span>Member Account Management</span>
          </h1>
          <p className="page-subtitle">
            Create member accounts, generate login credentials, manage room allocations, and review balances
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          <UserPlus size={16} /> Create New Member Account
        </button>
      </div>

      {/* Generated Credentials Callout */}
      {createdCredentials && (
        <div style={{
          background: 'var(--primary-50)',
          border: '1.5px solid var(--primary-300)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          animation: 'scaleIn 0.2s ease-out'
        }}>
          <div>
            <div style={{ fontWeight: 800, color: 'var(--primary-900)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} color="var(--primary-700)" /> Member Login Credentials Created for {createdCredentials.name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-800)', marginTop: '4px' }}>
              Email: <strong>{createdCredentials.email}</strong> | Temporary Password: <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{createdCredentials.pass}</code>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopyCredentials}
              className="btn btn-primary btn-sm"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy Credentials'}
            </button>
            <button
              onClick={() => setCreatedCredentials(null)}
              className="btn btn-outline btn-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="card" style={{ padding: '14px 18px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input 
            type="text"
            placeholder="Search members by name, email, or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '36px' }}
          />
        </div>
      </div>

      {/* Members Directory Table in Responsive Wrapper */}
      <div className="table-responsive-wrapper">
        <table>
          <thead>
            <tr>
              <th>Member Details</th>
              <th>Contact Info</th>
              <th>Room No</th>
              <th>Join Date</th>
              <th style={{ textAlign: 'right' }}>Deposited</th>
              <th style={{ textAlign: 'right' }}>Net Balance</th>
              <th style={{ textAlign: 'center' }}>Account Status</th>
              <th style={{ textAlign: 'center' }}>Manager Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map(member => {
              const summary = memberSummaries.find(s => s.memberId === member.id);
              const isInactive = member.status === 'INACTIVE';

              return (
                <tr key={member.id} style={{ opacity: isInactive ? 0.6 : 1, background: isInactive ? 'var(--slate-50)' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={member.avatarUrl} 
                        alt={member.name} 
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{member.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-700)' }}>{member.phone}</div>
                  </td>

                  <td>
                    <span className="badge badge-slate">{member.roomNo || 'Room 402'}</span>
                  </td>

                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {member.joinDate}
                  </td>

                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {formatBDT(summary?.totalDeposited || 0)}
                  </td>

                  <td style={{ 
                    textAlign: 'right', 
                    fontWeight: 800, 
                    color: (summary?.balance || 0) >= 0 ? 'var(--primary-700)' : 'var(--danger-600)' 
                  }}>
                    {formatBDT(summary?.balance || 0)}
                    <span style={{ fontSize: '0.7rem', display: 'block', fontWeight: 600 }}>
                      {(summary?.balance || 0) >= 0 ? 'Advance' : 'Due'}
                    </span>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${member.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {member.status}
                    </span>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => setEditingMember(member)}
                        className="btn btn-secondary btn-icon-only"
                        style={{ width: '32px', height: '32px', minHeight: '32px', padding: 0 }}
                        title="Edit Member Profile & Password"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Toggle active status for ${member.name}?`)) {
                            toggleMemberStatus(member.id);
                          }
                        }}
                        className={`btn ${member.status === 'ACTIVE' ? 'btn-danger' : 'btn-primary'} btn-sm`}
                        style={{ padding: '3px 8px', fontSize: '0.72rem', minHeight: '32px' }}
                      >
                        {member.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Member Account */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Member Account"
          subtitle="Only the Manager can create member accounts and generate login credentials"
        >
          <form onSubmit={handleCreateMember}>
            <div className="form-group">
              <label className="form-label">Member Full Name</label>
              <input 
                type="text"
                required
                placeholder="e.g. Mahfuzur Rahman"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Member Email (Login ID)</label>
                <input 
                  type="email"
                  required
                  placeholder="mahfuz@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <input 
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text"
                  required
                  placeholder="+880 1711-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room Allocation</label>
                <input 
                  type="text"
                  placeholder="Room 403"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Initial Opening Deposit (৳ BDT - Optional)</label>
              <input 
                type="number"
                min="0"
                step="100"
                value={initialDeposit}
                onChange={(e) => setInitialDeposit(Number(e.target.value))}
                className="form-control"
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Automatically credits advance money to the new member's ledger.
              </span>
            </div>

            <div className="modal-footer" style={{ padding: '16px 0 0 0', background: 'transparent' }}>
              <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <UserPlus size={16} /> Create Account & Generate Credentials
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Edit Member Account */}
      {editingMember && (
        <Modal
          isOpen={!!editingMember}
          onClose={() => setEditingMember(null)}
          title={`Edit Member: ${editingMember.name}`}
          subtitle="Update member details or reset password"
        >
          <form onSubmit={handleEditMember}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text"
                required
                value={editingMember.name}
                onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                className="form-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text"
                  required
                  value={editingMember.phone}
                  onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room Number</label>
                <input 
                  type="text"
                  value={editingMember.roomNo || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, roomNo: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reset Password</label>
              <input 
                type="text"
                value={editingMember.password || ''}
                onChange={(e) => setEditingMember({ ...editingMember, password: e.target.value })}
                className="form-control"
                placeholder="Set new password for member"
              />
            </div>

            <div className="modal-footer" style={{ padding: '16px 0 0 0', background: 'transparent' }}>
              <button type="button" onClick={() => setEditingMember(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <CheckCircle2 size={16} /> Save Member Details
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
