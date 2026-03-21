import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, X, AlertCircle } from 'lucide-react';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../utils/adminApi';
import { useToast } from '../../components/Toast';
import { validatePhoneNumber, validatePassword, validateUsername } from '../../utils/validation';
import '../../styles/admin.css';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    role: '',
    contact: '',
    joining_date: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      addToast('Failed to load employees: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setIsEditing(true);
      setFormData({
        employee_id: employee.employee_id,
        name: employee.name,
        role: employee.role,
        contact: employee.contact,
        joining_date: employee.joining_date,
        username: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      setIsEditing(false);
      setFormData({
        employee_id: '',
        name: '',
        role: '',
        contact: '',
        joining_date: new Date().toISOString().split('T')[0],
        username: '',
        password: '',
        confirmPassword: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update password strength when password field changes
    if (name === 'password' && !isEditing && value) {
      const validation = validatePassword(value);
      setPasswordStrength(validation.strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      if (isEditing) {
        // Validate phone number for edit
        const phoneVal = validatePhoneNumber(formData.contact);
        if (!phoneVal.valid) {
          setValidationErrors({ contact: phoneVal.message });
          addToast(phoneVal.message, 'error');
          return;
        }

        await updateEmployee(formData.employee_id, {
          name: formData.name,
          role: formData.role,
          contact_number: formData.contact
        });
        addToast('Employee updated successfully', 'success');
      } else {
        // Validate all fields for create
        const errors = {};

        const phoneVal = validatePhoneNumber(formData.contact);
        if (!phoneVal.valid) errors.contact = phoneVal.message;

        if (formData.username || formData.password || formData.confirmPassword) {
          const usernameVal = validateUsername(formData.username);
          if (!usernameVal.valid) errors.username = usernameVal.message;

          if (formData.password !== formData.confirmPassword) {
            errors.password = 'Passwords do not match';
          }

          if (!formData.password) {
            errors.password = 'Password is required';
          } else {
            const passwordVal = validatePassword(formData.password);
            if (!passwordVal.valid) {
              errors.password = passwordVal.message;
            }
          }

          if (!formData.username) {
            errors.username = 'Username is required';
          }
        }

        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          addToast('Please fix validation errors', 'error');
          return;
        }

        if (!formData.username || !formData.password) {
          addToast('Username and password are required', 'error');
          return;
        }

        await createEmployee({
          name: formData.name,
          role: formData.role,
          contact_number: formData.contact,
          joining_date: formData.joining_date,
          username: formData.username,
          password: formData.password
        });
        addToast('Employee added successfully', 'success');
      }
      handleCloseModal();
      loadEmployees();
    } catch (error) {
      addToast('Failed to save employee: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        addToast('Employee deleted successfully', 'success');
        loadEmployees();
      } catch (error) {
        addToast('Failed to delete employee: ' + error.message, 'error');
      }
    }
  };

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Employees Management</h1>
        <p>Manage your team and employee records</p>
      </header>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Employees</h3>
          <p className="stat-value">{employees.length}</p>
          <span className="stat-label">Team Members</span>
        </div>
        <div className="stat-box">
          <h3>Active Roles</h3>
          <p className="stat-value" style={{ color: '#3b82f6' }}>
            {new Set(employees.map((e) => e.role)).size}
          </p>
          <span className="stat-label">Unique Positions</span>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Add Employee
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-container">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading employees...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Role</th>
                  <th>Contact Number</th>
                  <th>Joining Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.employee_id}>
                      <td className="emp-name">{emp.name}</td>
                      <td>{emp.role}</td>
                      <td>{emp.contact}</td>
                      <td>{emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : 'N/A'}</td>
                      <td className="actions-cell">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleOpenModal(emp)}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(emp.employee_id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No employees found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Employee Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button className="close-modal" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter employee name"
                  />
                </div>

                <div className="form-group">
                  <label>Role *</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Laundry Specialist"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Number *</label>
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                    placeholder="10-digit phone number"
                    maxLength="10"
                    className={validationErrors.contact ? 'input-error' : ''}
                  />
                  {validationErrors.contact && (
                    <p className="field-error">
                      <AlertCircle size={16} />
                      {validationErrors.contact}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label>Joining Date *</label>
                  <input
                    type="date"
                    name="joining_date"
                    value={formData.joining_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {!isEditing && (
                  <>
                    <div className="form-group">
                      <label>Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required={!isEditing}
                        placeholder="3-20 characters (letters, numbers, underscore)"
                        className={validationErrors.username ? 'input-error' : ''}
                      />
                      {validationErrors.username && (
                        <p className="field-error">
                          <AlertCircle size={16} />
                          {validationErrors.username}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!isEditing}
                        placeholder="••••••••"
                        className={validationErrors.password ? 'input-error' : ''}
                      />
                      {formData.password && (
                        <div className="password-strength">
                          <div className="strength-bar">
                            <div
                              className={`strength-fill strength-${passwordStrength}`}
                              style={{
                                width: `${(passwordStrength / 5) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <span className={`strength-text strength-${passwordStrength}`}>
                            {passwordStrength === 0 && 'Weak'}
                            {passwordStrength === 1 && 'Very Weak'}
                            {passwordStrength === 2 && 'Fair'}
                            {passwordStrength === 3 && 'Good'}
                            {passwordStrength === 4 && 'Strong'}
                            {passwordStrength === 5 && 'Very Strong'}
                          </span>
                        </div>
                      )}
                      {validationErrors.password && (
                        <p className="field-error">
                          <AlertCircle size={16} />
                          {validationErrors.password}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Confirm Password *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required={!isEditing}
                        placeholder="••••••••"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {isEditing ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;
