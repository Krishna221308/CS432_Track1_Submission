import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Briefcase, Hash } from 'lucide-react';
import { useToast } from '../../components/Toast';
import '../../styles/dashboard.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  if (!user) return <div className="dashboard-view">Loading...</div>;

  const isEmployee = user.role === 'employee';
  const isUser = user.role === 'user';
  const isAdmin = user.role === 'admin';

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings.</p>
      </header>

      <div className="content-card profile-card">
        <div className="profile-hero">
          <div className="profile-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-main-info">
            <h2>{user.name || user.username}</h2>
            <span className="role-badge">{user.role.toUpperCase()}</span>
          </div>
        </div>

        <div className="profile-details-grid">
          <div className="detail-item">
            <div className="detail-label">
              <User size={16} />
              <span>Username</span>
            </div>
            <div className="detail-value">{user.username}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Hash size={16} />
              <span>Account ID</span>
            </div>
            <div className="detail-value">{user.id || user.memberId || user.employeeId || 'N/A'}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">
              <Phone size={16} />
              <span>Contact Number</span>
            </div>
            <div className="detail-value">{user.contact || user.contact_number || 'Not provided'}</div>
          </div>

          {isUser && (
            <>
              <div className="detail-item">
                <div className="detail-label">
                  <Mail size={16} />
                  <span>Email Address</span>
                </div>
                <div className="detail-value">{user.email || 'Not provided'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">
                  <Calendar size={16} />
                  <span>Age</span>
                </div>
                <div className="detail-value">{user.age || 'Not provided'}</div>
              </div>
            </>
          )}

          {isEmployee && (
            <div className="detail-item">
              <div className="detail-label">
                <Briefcase size={16} />
                <span>Job Role</span>
              </div>
              <div className="detail-value">{user.jobRole || user.role || 'Not provided'}</div>
            </div>
          )}
        </div>
        
        <div className="profile-actions" style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button className="primary-btn" onClick={() => addToast('Profile editing is not yet implemented', 'info')}>
            Edit Profile
          </button>
        </div>
      </div>

      <style>{`
        .profile-card {
          max-width: 800px;
        }
        .profile-hero {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
        }
        .profile-main-info h2 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--text-main);
        }
        .role-badge {
          display: inline-block;
          margin-top: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .profile-details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .detail-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .detail-value {
          font-size: 1rem;
          color: var(--text-main);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Profile;
