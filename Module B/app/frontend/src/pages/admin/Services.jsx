import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { 
  getAllServices, createService, updateService, deleteService,
  getAllPricing, createPricing, updatePricing, deletePricing, getClothingTypes
} from '../../utils/adminApi';
import '../../styles/dashboard.css';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [clothingTypes, setClothingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingPricing, setEditingPricing] = useState(null);
  const addToast = useToast();

  // Service form state
  const [sName, setSName] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sPrice, setSPrice] = useState('');

  // Pricing form state
  const [pServiceId, setPServiceId] = useState('');
  const [pTypeId, setPTypeId] = useState('');
  const [pPrice, setPPrice] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [servicesData, pricingData, typesData] = await Promise.all([
        getAllServices(),
        getAllPricing(),
        getClothingTypes()
      ]);
      setServices(servicesData);
      setPricing(pricingData);
      setClothingTypes(typesData);
    } catch (error) {
      addToast('Failed to load data: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Service handlers ──
  const openAddService = () => {
    setEditingService(null);
    setSName(''); setSDesc(''); setSPrice('');
    setShowServiceModal(true);
  };

  const openEditService = (s) => {
    setEditingService(s);
    setSName(s.service_name);
    setSDesc(s.service_description);
    setSPrice(s.base_price.toString());
    setShowServiceModal(true);
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    const data = { service_name: sName, service_description: sDesc, base_price: parseFloat(sPrice) };
    try {
      if (editingService) {
        await updateService(editingService.service_id, data);
        addToast('Service updated successfully', 'success');
      } else {
        await createService(data);
        addToast('Service added successfully', 'success');
      }
      setShowServiceModal(false);
      loadAllData();
    } catch (error) {
      addToast('Failed: ' + error.message, 'error');
    }
  };

  const handleDeleteService = async (id) => {
    if (confirm('Delete this service?')) {
      try {
        await deleteService(id);
        addToast('Service deleted successfully', 'info');
        loadAllData();
      } catch (error) {
        addToast('Failed to delete service: ' + error.message, 'error');
      }
    }
  };

  // ── Pricing handlers ──
  const openAddPricing = () => {
    setEditingPricing(null);
    setPServiceId(services[0]?.service_id || '');
    setPTypeId(clothingTypes[0]?.type_id || '');
    setPPrice('');
    setShowPricingModal(true);
  };

  const openEditPricing = (p) => {
    setEditingPricing(p);
    setPServiceId(p.service_id);
    setPTypeId(p.type_id);
    setPPrice(p.price.toString());
    setShowPricingModal(true);
  };

  const handleSavePricing = async (e) => {
    e.preventDefault();
    const data = { service_id: pServiceId, type_id: pTypeId, price: parseFloat(pPrice) };
    try {
      if (editingPricing) {
        await updatePricing(editingPricing.price_id, data);
        addToast('Pricing rule updated successfully', 'success');
      } else {
        await createPricing(data);
        addToast('Pricing rule added successfully', 'success');
      }
      setShowPricingModal(false);
      loadAllData();
    } catch (error) {
      addToast('Failed: ' + error.message, 'error');
    }
  };

  const handleDeletePricing = async (id) => {
    if (confirm('Delete this pricing rule?')) {
      try {
        await deletePricing(id);
        addToast('Pricing rule deleted successfully', 'info');
        loadAllData();
      } catch (error) {
        addToast('Failed to delete pricing rule: ' + error.message, 'error');
      }
    }
  };

  const getServiceName = (id) => services.find((s) => s.service_id === id)?.service_name || id;

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h1>Services &amp; Pricing</h1>
        <p>Manage services offered and their pricing rules. Changes appear on the landing page.</p>
      </header>

      {/* ── Services Table ── */}
      <div className="content-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2>Services</h2>
          <button className="primary-btn" onClick={openAddService}>
            <Plus size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Add Service
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Base Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="no-data">Loading...</td>
                </tr>
              ) : services.length > 0 ? (
                services.map((s) => (
                  <tr key={s.service_id}>
                    <td>{s.service_id}</td>
                    <td style={{ fontWeight: 600 }}>{s.service_name}</td>
                    <td style={{ maxWidth: 300, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.service_description}</td>
                    <td>₹{s.base_price}</td>
                    <td>
                      <button className="table-action" onClick={() => openEditService(s)} style={{ marginRight: 8 }}>
                        <Pencil size={16} />
                      </button>
                      <button className="table-action" onClick={() => handleDeleteService(s.service_id)} style={{ color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">No services found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pricing Table ── */}
      <div className="content-card">
        <div className="card-header">
          <h2>Pricing Rules</h2>
          <button className="primary-btn" onClick={openAddPricing}>
            <Plus size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} /> Add Rule
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Service</th>
                <th>Clothing Type</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="no-data">Loading...</td>
                </tr>
              ) : pricing.length > 0 ? (
                pricing.map((p) => (
                  <tr key={p.price_id}>
                    <td>{p.price_id}</td>
                    <td style={{ fontWeight: 600 }}>{p.service_name}</td>
                    <td>{p.type_name}</td>
                    <td>₹{p.price.toFixed(2)}</td>
                    <td>
                      <button className="table-action" onClick={() => openEditPricing(p)} style={{ marginRight: 8 }}>
                        <Pencil size={16} />
                      </button>
                      <button className="table-action" onClick={() => handleDeletePricing(p.price_id)} style={{ color: '#ef4444' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">No pricing rules found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Service Modal ── */}
      {showServiceModal && (
        <div className="modal-overlay" onClick={() => setShowServiceModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingService ? 'Edit Service' : 'Add Service'}</h3>
              <button onClick={() => setShowServiceModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveService} className="modal-form">
              <label>Service Name</label>
              <input value={sName} onChange={(e) => setSName(e.target.value)} required placeholder="e.g. Dry Cleaning" />
              <label>Description</label>
              <textarea value={sDesc} onChange={(e) => setSDesc(e.target.value)} required rows={3} placeholder="Brief description of the service" />
              <label>Base Price (₹)</label>
              <input type="number" value={sPrice} onChange={(e) => setSPrice(e.target.value)} required min="0" step="0.01" />
              <button type="submit" className="primary-btn" style={{ marginTop: '1rem', width: '100%' }}>
                {editingService ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Pricing Modal ── */}
      {showPricingModal && (
        <div className="modal-overlay" onClick={() => setShowPricingModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPricing ? 'Edit Pricing Rule' : 'Add Pricing Rule'}</h3>
              <button onClick={() => setShowPricingModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSavePricing} className="modal-form">
              <label>Service</label>
              <select value={pServiceId} onChange={(e) => setPServiceId(e.target.value)} required>
                <option value="">-- Select Service --</option>
                {services.map((s) => (
                  <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
                ))}
              </select>
              <label>Clothing Type</label>
              <select value={pTypeId} onChange={(e) => setPTypeId(e.target.value)} required>
                <option value="">-- Select Clothing Type --</option>
                {clothingTypes.map((ct) => (
                  <option key={ct.type_id} value={ct.type_id}>{ct.type_name}</option>
                ))}
              </select>
              <label>Price (₹)</label>
              <input type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)} required min="0" step="0.01" />
              <button type="submit" className="primary-btn" style={{ marginTop: '1rem', width: '100%' }}>
                {editingPricing ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
