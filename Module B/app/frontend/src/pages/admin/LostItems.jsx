import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit } from 'lucide-react';
import { getAllLostItems } from '../../utils/adminApi';
import { useToast } from '../../components/Toast';
import '../../styles/admin.css';

const AdminLostItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const addToast = useToast();

  useEffect(() => {
    loadLostItems();
  }, []);

  const loadLostItems = async () => {
    setLoading(true);
    try {
      const data = await getAllLostItems();
      setLostItems(data);
    } catch (error) {
      addToast('Failed to load lost items: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = lostItems.filter((item) => {
    const matchesSearch =
      item.lost_item_id.toString().includes(searchTerm.toLowerCase()) ||
      item.order_id.toString().includes(searchTerm.toLowerCase()) ||
      item.item_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.member_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="admin-page">
      <header className="page-header">
        <h1>Lost & Damaged Items</h1>
        <p>Track and manage customer reported lost or damaged items</p>
      </header>

      <div className="stats-section">
        <div className="stat-box">
          <h3>Total Reported</h3>
          <p className="stat-value">{lostItems.length}</p>
          <span className="stat-label">Lost/Damaged Items</span>
        </div>
        <div className="stat-box">
          <h3>Total Compensation</h3>
          <p className="stat-value" style={{ color: '#f59e0b' }}>
            ₹{lostItems.reduce((sum, i) => sum + i.compensation_amount, 0).toFixed(2)}
          </p>
          <span className="stat-label">Amount</span>
        </div>
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
                <th>Claim ID</th>
                <th>Order ID</th>
                <th>Item Description</th>
                <th>Reported Date</th>
                <th>Compensation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="no-data">Loading...</td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.lost_item_id}>
                    <td className="item-id">{item.lost_item_id}</td>
                    <td>{item.order_id}</td>
                    <td>{item.item_description}</td>
                    <td>{new Date(item.reported_date).toLocaleDateString()}</td>
                    <td className="amount">₹{item.compensation_amount.toFixed(2)}</td>
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
                    No lost items found
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
                  <label>Claim ID</label>
                  <p>{selectedItem.lost_item_id}</p>
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
                  <p>{new Date(selectedItem.reported_date).toLocaleDateString()}</p>
                </div>
                <div className="detail-item">
                  <label>Compensation Amount</label>
                  <p className="amount-highlight">₹{selectedItem.compensation_amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLostItems;
