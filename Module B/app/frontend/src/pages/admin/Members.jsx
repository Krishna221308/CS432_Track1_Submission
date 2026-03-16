import React, { useState, useMemo, useEffect } from 'react';
import { Search, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '../../components/Toast';
import '../../styles/admin.css';

const AdminMembers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const addToast = useToast();

  const [members, setMembers] = useState([]);
  const [memberAssignments, setMemberAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // TODO: Fetch members, assignments, and employees from backend API
    // setMembers(fetchedMembers);
    // setMemberAssignments(fetchedAssignments);
    // setEmployees(fetchedEmployees);
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.member_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [searchTerm, members]);

  const getAssignedEmployeeName = (memberId) => {
    // TODO: Find assigned employee from state/API
    // const assignment = memberAssignments.find(a => a.member_id === memberId);
    // const employee = employees.find(e => e.employee_id === assignment?.employee_id);
    return 'Unassigned';
  };

  const handleAssignClick = (member) => {
    setEditingMember(member);
    const assignment = memberAssignments.find((a) => a.member_id === member.member_id);
    setSelectedEmployee(assignment ? assignment.employee_id : '');
    setShowAssignModal(true);
  };

  const handleSaveAssignment = () => {
    if (editingMember && selectedEmployee) {
      // TODO: Call API to assign member to employee
      // assignMemberToEmployee(editingMember.member_id, selectedEmployee);
      addToast('Member assigned (Placeholder)', 'success');
      setShowAssignModal(false);
      setEditingMember(null);
      setSelectedEmployee('');
    }
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      // TODO: Call API to delete member
      // deleteMember(memberToDelete.member_id);
      addToast('Member deleted (Placeholder)', 'success');
      setShowDeleteConfirm(false);
      setMemberToDelete(null);
    }
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Members Management</h1>
        <p>Assign members to employees for order handling</p>
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
          <button className="filter-btn">
            Assigned ({memberAssignments.length})
          </button>
          <button className="filter-btn">
            Unassigned ({members.length - memberAssignments.length})
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member ID</th>
                <th>Member Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Reg. Date</th>
                <th>Assigned Employee</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member.member_id}>
                    <td className="order-id">{member.member_id}</td>
                    <td>{member.member_name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>{member.registration_date}</td>
                    <td>
                      <span className="assignment-badge">
                        {getAssignedEmployeeName(member.member_id)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleAssignClick(member)}
                          title="Assign to Employee"
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
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && editingMember && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Member to Employee</h2>
              <button className="close-modal" onClick={() => setShowAssignModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Member ID</label>
                  <p>{editingMember.member_id}</p>
                </div>
                <div className="detail-item">
                  <label>Member Name</label>
                  <p>{editingMember.member_name}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{editingMember.email}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{editingMember.phone}</p>
                </div>

                <div className="detail-item full-width">
                  <label htmlFor="employee-select">Assign to Employee</label>
                  <select
                    id="employee-select"
                    className="form-select"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">-- Select Employee --</option>
                    {employees.map((employee) => (
                      <option key={employee.employee_id} value={employee.employee_id}>
                        {employee.employee_name} ({employee.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveAssignment}
                  disabled={!selectedEmployee}
                >
                  Assign Member
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
