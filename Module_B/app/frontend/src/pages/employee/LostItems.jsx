import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import { getAssignedLostItems } from '../../utils/employeeApi';
import '../../styles/admin.css';

const EmployeeLostItems = () => {
  const currentEmployee = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.employeeId;
  }, []);

  const [lostItems, setLostItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentEmployee) {
      setError('No employee ID found.');
      setLoading(false);
      return;
    }
    const fetchItems = async () => {
      setLoading(true);
      try {
        const data = await getAssignedLostItems(currentEmployee);
        setLostItems(data);
      } catch (err) {
        setError(err.message || 'Failed to load lost items');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [currentEmployee]);

  // IDs are numbers from DB → convert to string for .includes() search
  const filteredItems = lostItems.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      String(item.lost_id).toLowerCase().includes(search) ||
      String(item.order_id).toLowerCase().includes(search) ||
      (item.item_description || '').toLowerCase().includes(search)
    );
  });

  const totalCompensation = lostItems.reduce((s, i) => s + (i.compensation_amount || 0), 0);
  const avgCompensation = lostItems.length > 0 ? (totalCompensation / lostItems.length) : 0;

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Assigned Orders — Lost/Damaged Items</h1>
        <p>Track and manage lost or damaged items from your assigned orders</p>
      </header>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 16 }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Stats ── */}
      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Reported</h3>
          <p className="stat-value">{lostItems.length}</p>
          <span className="stat-label">Items</span>
        </div>
        <div className="stat-box">
          <h3>Total Compensation</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>
            ₹{totalCompensation.toFixed(2)}
          </p>
          <span className="stat-label">Amount</span>
        </div>
        {lostItems.length > 0 && (
          <div className="stat-box">
            <h3>Average Compensation</h3>
            <p className="stat-value" style={{ color: '#ef4444' }}>
              ₹{avgCompensation.toFixed(2)}
            </p>
            <span className="stat-label">Per Item</span>
          </div>
        )}
      </div>

      {/* ── Search ── */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by Lost ID, Order ID, or Item description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="table-card">
        <div className="table-container">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>Loading items…</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Lost ID</th>
                  <th>Order ID</th>
                  <th>Item Description</th>
                  <th>Reported Date</th>
                  <th>Compensation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.lost_id}>
                      <td className="item-id">{item.lost_id}</td>
                      <td>{item.order_id}</td>
                      <td>{item.item_description}</td>
                      <td>{item.reported_date}</td>
                      <td className="amount">₹{(item.compensation_amount || 0).toFixed(2)}</td>
                      <td>
                        <button
                          className="action-btn view-btn"
                          onClick={() => setSelectedItem(item)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      {lostItems.length === 0 ? 'No issues reported' : 'No lost items match your search'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Item Details Modal ── */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Lost/Damaged Item Details</h2>
              <button className="close-modal" onClick={() => setSelectedItem(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Lost ID</label>
                  <p>{selectedItem.lost_id}</p>
                </div>
                <div className="detail-item">
                  <label>Order ID</label>
                  <p>{selectedItem.order_id}</p>
                </div>
                <div className="detail-item">
                  <label>Item Description</label>
                  <p>{selectedItem.item_description}</p>
                </div>
                <div className="detail-item">
                  <label>Reported Date</label>
                  <p>{selectedItem.reported_date}</p>
                </div>
                <div className="detail-item">
                  <label>Compensation Amount</label>
                  <p className="amount-highlight">₹{(selectedItem.compensation_amount || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLostItems;
