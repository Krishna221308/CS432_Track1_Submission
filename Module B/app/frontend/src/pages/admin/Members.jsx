import React, { useState, useMemo, useEffect } from 'react';
import { Search, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { getAllMembers, updateMember, deleteMember, getAllEmployees } from '../../utils/adminApi';
import { useToast } from '../../components/Toast';
import '../../styles/admin.css';

const AdminMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: '', age: '', email: '', contact: '', address: '', assigned_employee_id: '' });
  const addToast = useToast();

  useEffect(() => {
    loadMembers();
    loadEmployees();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await getAllMembers();
      setMembers(data);
    } catch (error) {
      addToast('Failed to load members: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      addToast('Failed to load employees: ' + error.message, 'error');
    }
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.member_id.toString().includes(searchTerm.toLowerCase()) ||
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, members]);

  const handleEditClick = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      age: member.age,
      email: member.email,
      contact: member.contact,
      address: member.address,
      assigned_employee_id: member.assigned_employee_id || ''
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (editingMember && formData.name && formData.email && formData.contact) {
      try {
        await updateMember(editingMember.member_id, formData);
        addToast('Member updated successfully', 'success');
        setShowEditModal(false);
        setEditingMember(null);
        loadMembers();
      } catch (error) {
        addToast('Failed to update member: ' + error.message, 'error');
      }
    } else {
      addToast('Please fill in all required fields', 'error');
    }
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (memberToDelete) {
      try {
        await deleteMember(memberToDelete.member_id);
        addToast('Member deleted successfully', 'success');
        setShowDeleteConfirm(false);
        setMemberToDelete(null);
        loadMembers();
      } catch (error) {
        addToast('Failed to delete member: ' + error.message, 'error');
      }
    }
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Members Management</h1>
        <p>View and manage member profiles</p>
      </header>

      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by Member ID, Name, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button className="filter-btn active">
            Total Members ({members.length})
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading members...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Age</th>
                  <th>Address</th>
                  <th>Assigned Employee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr key={member.member_id}>
                      <td className="order-id">{member.member_id}</td>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>{member.contact}</td>
                      <td>{member.age}</td>
                      <td>{member.address}</td>
                      <td>
                        {member.assigned_employee_name ? (
                          <span className="assignment-badge">{member.assigned_employee_name}</span>
                        ) : (
                          <span className="unassigned-badge">Unassigned</span>
                        )}
                      </td>
                      <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditClick(member)}
                          title="Edit Member"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteClick(member)}
                          title="Delete Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Member</h2>
              <button className="close-modal" onClick={() => setShowEditModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Member ID</label>
                  <p style={{ margin: 0 }}>{editingMember.member_id}</p>
                </div>
                <div className="detail-item">
                  <label htmlFor="name">Name *</label>
                  <input
                    id="name"
                    className="form-input"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="detail-item">
                  <label htmlFor="age">Age</label>
                  <input
                    id="age"
                    className="form-input"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div className="detail-item">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    className="form-input"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="detail-item">
                  <label htmlFor="contact">Contact *</label>
                  <input
                    id="contact"
                    className="form-input"
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  />
                </div>
                <div className="detail-item full-width">
                  <label htmlFor="address">Address</label>
                  <input
                    id="address"
                    className="form-input"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="detail-item full-width">
                  <label htmlFor="assigned_employee_id">Assign Employee</label>
                  <select
                    id="assigned_employee_id"
                    className="form-select"
                    value={formData.assigned_employee_id}
                    onChange={(e) => setFormData({ ...formData, assigned_employee_id: e.target.value })}
                  >
                    <option value="">-- Unassigned --</option>
                    {employees.map((emp) => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.name} ({emp.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && memberToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Member</h2>
              <button className="close-modal" onClick={() => setShowDeleteConfirm(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="delete-warning">
                Are you sure you want to <strong>delete {memberToDelete.member_name}</strong>?
              </p>
              <p className="delete-info">
                This action cannot be undone. All assignments and data related to this member will be removed.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .assignment-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #e0e7ff;
          color: #3730a3;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .unassigned-badge {
          display: inline-block;
          padding: 4px 12px;
          background: #f3f4f6;
          color: #6b7280;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .form-select {
          width: 100%;
          padding: 10px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background-color: #fff;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .form-select:hover {
          border-color: #d1d5db;
        }

        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .edit-btn {
          background: #f3f4f6;
          color: #1f2937;
          border: none;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edit-btn:hover {
          background: #e5e7eb;
          color: #000;
        }

        .delete-btn {
          background: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delete-btn:hover {
          background: #fecaca;
          color: #b91c1c;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn-danger:hover {
          background: #b91c1c;
        }

        .delete-modal {
          max-width: 400px;
        }

        .delete-warning {
          color: #dc2626;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .delete-info {
          color: #6b7280;
          font-size: 0.9rem;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default AdminMembers;
