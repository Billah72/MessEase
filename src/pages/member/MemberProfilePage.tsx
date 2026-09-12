import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone, 
  Home, 
  Calendar, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Save,
  ShieldCheck
} from 'lucide-react';

export const MemberProfilePage: React.FC = () => {
  const { currentUser, changePassword, updateCurrentUserProfile } = useAuth();

  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);

  // Change password states
  const [currentPass, setCurrentPass] = useState<string>('');
  const [newPass, setNewPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [passError, setPassError] = useState<string>('');
  const [passSuccess, setPassSuccess] = useState<boolean>(false);

  const handleUpdatePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateCurrentUserProfile({ phone });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (!currentUser) return;

    const storedPass = currentUser.password || 'member123';
    if (currentPass !== storedPass) {
      setPassError('Current password is incorrect.');
      return;
    }

    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }

    if (newPass !== confirmPass) {
      setPassError('New password and confirmation do not match.');
      return;
    }

    changePassword(newPass);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setPassSuccess(true);
    setTimeout(() => setPassSuccess(false), 4000);
  };

  return (
    <div className="page-content-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px', maxWidth: '900px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
          My Account & Security (আমার প্রোফাইল)
        </h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
          Manage your contact information and change your login password.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          <img 
            src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
            alt={currentUser?.name}
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{currentUser?.name}</h2>
              <span style={{ padding: '2px 8px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700 }}>
                {currentUser?.status || 'ACTIVE'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={14} /> {currentUser?.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Home size={14} /> {currentUser?.roomNo || 'Room 402'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} /> Joined {currentUser?.joinDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Contact Info + Password Change */}
      <div className="grid-responsive-2" style={{ gap: '20px' }}>
        
        {/* Contact Info Form */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
              <Phone size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Contact Details</h3>
          </div>

          {profileSuccess && (
            <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Phone number updated successfully!
            </div>
          )}

          <form onSubmit={handleUpdatePhone} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Full Name (Manager Managed)
              </label>
              <input
                type="text"
                value={currentUser?.name || ''}
                disabled
                className="form-control"
                style={{ background: 'var(--bg-main)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Email Address (Login ID)
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="form-control"
                style={{ background: 'var(--bg-main)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Phone Number (মোবাইল নম্বর)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 17XX-XXXXXX"
                className="form-control"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Room & Seat Number
              </label>
              <input
                type="text"
                value={currentUser?.roomNo || 'Room 402'}
                disabled
                className="form-control"
                style={{ background: 'var(--bg-main)', cursor: 'not-allowed', color: 'var(--text-muted)' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Save size={16} /> Save Contact Info
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ background: '#ede9fe', color: '#7c3aed', padding: '8px', borderRadius: '10px' }}>
              <Key size={20} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Change Login Password</h3>
          </div>

          {passError && (
            <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> {passError}
            </div>
          )}

          {passSuccess && (
            <div style={{ padding: '10px 14px', background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Password updated successfully! Use your new password next time.
            </div>
          )}

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Current Password (বর্তমান পাসওয়ার্ড)
              </label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="Enter current password (demo: member123)"
                className="form-control"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                New Password (নতুন পাসওয়ার্ড)
              </label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimum 6 characters"
                className="form-control"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Confirm New Password (পুনরায় লিখুন)
              </label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Retype new password"
                className="form-control"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ShieldCheck size={16} /> Update Password
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
