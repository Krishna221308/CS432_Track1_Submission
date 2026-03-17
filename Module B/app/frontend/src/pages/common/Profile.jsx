import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Briefcase, Hash, Lock, X } from 'lucide-react';
import { getUserProfile, updateUserProfile, changeUserPassword, getEmployeeProfile, updateEmployeeProfile, changeEmployeePassword } from '../../utils/adminApi';
import { useToast } from '../../components/Toast';
import '../../styles/dashboard.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    loadUserProfile(storedUser);
  }, []);

  const loadUserProfile = async (storedUser) => {
    try {
      let profileData;
      if (storedUser.role === 'user' && storedUser.memberId) {
        profileData = await getUserProfile(storedUser.memberId);
      } else if (storedUser.role === 'employee' && storedUser.employeeId) {
        profileData = await getEmployeeProfile(storedUser.employeeId);
      } else {
        profileData = {};
      }
      const fullUser = { ...storedUser, ...profileData };
      setUser(fullUser);
      setEditFormData(fullUser);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setUser(storedUser);
      setEditFormData(storedUser);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      if (user.role === 'user' && user.member_id) {
        await updateUserProfile(user.member_id, {
          name: editFormData.name,
          age: editFormData.age,
          email: editFormData.email,
          contact: editFormData.contact,
          address: editFormData.address
        });
      } else if (user.role === 'employee' && user.employee_id) {
        await updateEmployeeProfile(user.employee_id, {
          name: editFormData.name,
          role: editFormData.role,
          contact: editFormData.contact,
          joining_date: editFormData.joining_date
        });
      }
      setUser(editFormData);
      setIsEditing(false);
      addToast('Profile updated successfully', 'success');
    } catch (error) {
      addToast('Failed to update profile: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      addToast('Please fill in all password fields', 'error');
      return;
    }

    setLoading(true);
    try {
      if (user.role === 'user' && user.member_id) {
        await changeUserPassword(user.member_id, passwordData.oldPassword, passwordData.newPassword);
      } else if (user.role === 'employee' && user.employee_id) {
        await changeEmployeePassword(user.employee_id, passwordData.oldPassword, passwordData.newPassword);
      }
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
      addToast('Password changed successfully', 'success');
    } catch (error) {
      addToast('Failed to change password: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="dashboard-view">Loading...</div>;

  const isEmployee = user.role === 'employee';
  const isUser = user.role === 'user';

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings.</p>
      </header>

      <div className="content-card profile-card">
        {!isEditing ? (
          <>
            <div className="profile-hero">
              <div className="profile-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : (user.username ? user.username.charAt(0).toUpperCase() : 'U')}
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
                <div className="detail-value">{user.member_id || user.employee_id || 'N/A'}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">
                  <Phone size={16} />
                  <span>Contact Number</span>
                </div>
                <div className="detail-value">{user.contact || 'Not provided'}</div>
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
                  {user.address && (
                    <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                      <div className="detail-label">
                        <span>Address</span>
                      </div>
                      <div className="detail-value">{user.address}</div>
                    </div>
                  )}
                </>
              )}

              {isEmployee && (
                <>
                  <div className="detail-item">
                    <div className="detail-label">
                      <Briefcase size={16} />
                      <span>Job Role</span>
                    </div>
                    <div className="detail-value">{user.role || 'Not provided'}</div>
                  </div>
                  {user.joining_date && (
                    <div className="detail-item">
                      <div className="detail-label">
                        <Calendar size={16} />
                        <span>Joining Date</span>
                      </div>
                      <div className="detail-value">{new Date(user.joining_date).toLocaleDateString()}</div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="profile-actions">
              <button className="primary-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
              <button className="secondary-btn" onClick={() => setShowChangePassword(true)}>
                <Lock size={16} />
                Change Password
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ marginBottom: '1.5rem' }}>Edit Profile</h3>
            <div className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name || ''}
                  onChange={handleEditChange}
                  placeholder="Your name"
                />
              </div>

              {isUser && (
                <>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email || ''}
                      onChange={handleEditChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Age</label>
                    <input
                      type="number"
                      name="age"
                      value={editFormData.age || ''}
                      onChange={handleEditChange}
                      placeholder="Age"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address || ''}
                      onChange={handleEditChange}
                      placeholder="Your address"
                    />
                  </div>
                </>
              )}

              {isEmployee && (
                <>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      name="role"
                      value={editFormData.role || ''}
                      onChange={handleEditChange}
                      placeholder="Job role"
                    />
                  </div>
                  <div className="form-group">
                    <label>Joining Date</label>
                    <input
                      type="date"
                      name="joining_date"
                      value={editFormData.joining_date || ''}
                      onChange={handleEditChange}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  value={editFormData.contact || ''}
                  onChange={handleEditChange}
                  placeholder="Phone number"
                />
              </div>

              <div className="edit-actions">
                <button className="secondary-btn" onClick={() => {
                  setIsEditing(false);
                  setEditFormData(user);
                }}>
                  Cancel
                </button>
                <button className="primary-btn" onClick={handleSaveProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="close-modal" onClick={() => setShowChangePassword(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="secondary-btn" onClick={() => setShowChangePassword(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleChangePassword} disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          margin-bottom: 2rem;
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
        .profile-actions {
          display: flex;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          margin-top: 2rem;
        }
        .primary-btn {
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .primary-btn:hover:not(:disabled) {
          background: var(--primary-dark);
        }
        .secondary-btn {
          padding: 0.75rem 1.5rem;
          background: var(--background-light);
          color: var(--text-main);
          border: 1px solid var(--border);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .secondary-btn:hover:not(:disabled) {
          background: var(--border);
        }
        .edit-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-weight: 600;
          color: var(--text-main);
          font-size: 0.85rem;
        }
        .form-group input {
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--background);
          color: var(--text-main);
          font-size: 0.95rem;
        }
        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-light);
        }
        .edit-actions {
          display: flex;
          gap: 1rem;
          grid-column: 1 / -1;
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: var(--background);
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 90%;
          max-width: 450px;
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid var(--border);
        }
        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        .close-modal {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .modal-footer {
          display: flex;
          gap: 1rem;
          padding: 20px;
          border-top: 1px solid var(--border);
          justify-content: flex-end;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Profile;
