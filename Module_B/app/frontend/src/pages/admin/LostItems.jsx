import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Zap, ListFilter, RefreshCw } from 'lucide-react';
import { getAllLostItems, fastSearchLostItem, rangeSearchLostItems, refreshLostItemsCache } from '../../utils/adminApi';
import { useToast } from '../../components/Toast';
import '../../styles/admin.css';

const AdminLostItems = () => {
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // B+ Tree Search States
  const [fastSearchId, setFastSearchId] = useState('');
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  
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

  const handleFastSearch = async () => {
    if (!fastSearchId) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const result = await fastSearchLostItem(fastSearchId);
      setSearchResult({ type: 'single', data: result });
      addToast('B+ Tree Search completed in O(log N)', 'success');
    } catch (error) {
      addToast('Fast Search Failed: ' + error.message, 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleRangeSearch = async () => {
    if (!rangeStart || !rangeEnd) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const result = await rangeSearchLostItems(rangeStart, rangeEnd);
      setSearchResult({ type: 'range', data: result });
      addToast(`B+ Tree Range Search: ${result.count} items found`, 'success');
    } catch (error) {
      addToast('Range Search Failed: ' + error.message, 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleRefreshCache = async () => {
    try {
      await refreshLostItemsCache();
      addToast('B+ Tree Index refreshed from database', 'success');
    } catch (error) {
      addToast('Refresh Failed: ' + error.message, 'error');
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

      {/* Module A: B+ Tree Integration Section */}
      <div className="bplus-tree-section" style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={20} color="#f59e0b" fill="#f59e0b" />
            Module A: B+ Tree High-Speed Indexer
          </h2>
          <button 
            onClick={handleRefreshCache}
            className="action-btn" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}
          >
            <RefreshCw size={16} /> Sync Index
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="fast-search-box">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#64748b' }}>Fast ID Search (O(log N))</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="Enter Lost ID..." 
                value={fastSearchId}
                onChange={(e) => setFastSearchId(e.target.value)}
                style={{ flex: 1, padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
              <button 
                onClick={handleFastSearch}
                disabled={searching}
                style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '6px', cursor: 'pointer' }}
              >
                {searching ? '...' : <Zap size={18} />}
              </button>
            </div>
          </div>
          
          <div className="range-search-box">
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#64748b' }}>ID Range Query</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="number" 
                placeholder="Start" 
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                style={{ width: '80px', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
              <input 
                type="number" 
                placeholder="End" 
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                style={{ width: '80px', padding: '0.625rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
              <button 
                onClick={handleRangeSearch}
                disabled={searching}
                style={{ flex: 1, background: '#0f172a', color: 'white', border: 'none', padding: '0 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <ListFilter size={18} /> Range Search
              </button>
            </div>
          </div>
        </div>

        {searchResult && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px dashed #3b82f6' }}>
            <h4 style={{ fontSize: '0.875rem', color: '#3b82f6', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Search Results ({searchResult.data.engine})
            </h4>
            {searchResult.type === 'single' ? (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontWeight: 'bold' }}>#{searchResult.data.lost_item_id}:</span>
                <span>{searchResult.data.item_description}</span>
              </div>
            ) : (
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {searchResult.data.results.map(r => (
                  <div key={r.lost_id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #f1f5f9', padding: '0.25rem 0' }}>
                    <span style={{ fontWeight: 'bold', minWidth: '40px' }}>#{r.lost_id}:</span>
                    <span>{r.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

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
