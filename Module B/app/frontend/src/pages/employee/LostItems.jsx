import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, AlertTriangle } from 'lucide-react';
import '../../styles/admin.css';

const EmployeeLostItems = () => {
  // Get current employee from auth
  const currentEmployee = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.employeeId || 'EMP-001';
  }, []);

  const [lostItems, setLostItems] = useState([]);

  useEffect(() => {
    // TODO: Fetch lost items for assigned orders from backend API
    // setLostItems(fetchedItems);
  }, [currentEmployee]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = lostItems.filter((item) => {
    const matchesSearch =
      item.lost_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item_description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Assigned Orders - Lost/Damaged Items</h1>
        <p>Track and manage lost or damaged items from your assigned orders</p>
      </header>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Reported</h3>
          <p className="stat-value">{lostItems.length}</p>
          <span className="stat-label">Items</span>
        </div>
        <div className="stat-box">
          <h3>Total Compensation</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>
            ${lostItems.reduce((sum, i) => sum + i.compensation_amount, 0).toFixed(2)}
          </p>
          <span className="stat-label">Amount</span>
        </div>
        {lostItems.length > 0 && (
          <div className="stat-box">
            <h3>Average Compensation</h3>
            <p className="stat-value" style={{ color: '#ef4444' }}>
              ${(lostItems.reduce((sum, i) => sum + i.compensation_amount, 0) / lostItems.length).toFixed(2)}
            </p>
            <span className="stat-label">Per Item</span>
          </div>
        )}
      </div>

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

      <div className="table-card">
        <div className="table-container">
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
                    <td className="amount">${item.compensation_amount.toFixed(2)}</td>
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
                    {lostItems.length === 0 ? 'No issues reported' : 'No lost items found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Lost/Damaged Item Details</h2>
              <button className="close-modal" onClick={() => setSelectedItem(null)}>
                ×
              </button>
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
                  <p className="amount-highlight">${selectedItem.compensation_amount.toFixed(2)}</p>
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
