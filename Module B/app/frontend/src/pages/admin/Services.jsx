import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useToast } from '../../components/Toast';
import '../../styles/dashboard.css';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState([]);
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
  const [pClothType, setPClothType] = useState('');
  const [pPrice, setPPrice] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  const [clothingTypes, setClothingTypes] = useState([]);

  const refresh = () => {
    // TODO: Fetch services, pricing, and clothing types from backend API
    // setServices(fetchedServices);
    // setPricing(fetchedPricing);
    // setClothingTypes(fetchedClothingTypes);
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

  const handleSaveService = (e) => {
    e.preventDefault();
    const data = { service_name: sName, service_description: sDesc, base_price: parseFloat(sPrice) };
    if (editingService) {
      // TODO: Call API to update service
      // updateService(editingService.service_id, data);
      addToast('Service updated (Placeholder)', 'success');
    } else {
      // TODO: Call API to add service
      // addService(data);
      addToast('Service added (Placeholder)', 'success');
    }
    setShowServiceModal(false);
    // refresh();
  };

  const handleDeleteService = (id) => {
    if (confirm('Delete this service? Associated pricing rules will remain.')) {
      // TODO: Call API to delete service
      // deleteService(id);
      addToast('Service deleted (Placeholder)', 'info');
      // refresh();
    }
  };

  // ── Pricing handlers ──
  const openAddPricing = () => {
    setEditingPricing(null);
    setPServiceId(services[0]?.service_id || '');
    setPClothType(clothingTypes[0]?.type_name || '');
    setPPrice('');
    setShowPricingModal(true);
  };

  const openEditPricing = (p) => {
    setEditingPricing(p);
    setPServiceId(p.service_id);
    setPClothType(p.cloth_type);
    setPPrice(p.price.toString());
    setShowPricingModal(true);
  };

  const handleSavePricing = (e) => {
    e.preventDefault();
    const data = { service_id: pServiceId, cloth_type: pClothType, price: parseFloat(pPrice) };
    if (editingPricing) {
      // TODO: Call API to update pricing rule
      // updatePricingRule(editingPricing.price_id, data);
      addToast('Pricing rule updated (Placeholder)', 'success');
    } else {
      // TODO: Call API to add pricing rule
      // addPricingRule(data);
      addToast('Pricing rule added (Placeholder)', 'success');
    }
    setShowPricingModal(false);
    // refresh();
  };

  const handleDeletePricing = (id) => {
    if (confirm('Delete this pricing rule?')) {
      // TODO: Call API to delete pricing rule
      // deletePricingRule(id);
      addToast('Pricing rule deleted (Placeholder)', 'info');
      // refresh();
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
              {services.map((s) => (
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
              ))}
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
                <th>Cloth Type</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((p) => (
                <tr key={p.price_id}>
                  <td>{p.price_id}</td>
                  <td style={{ fontWeight: 600 }}>{getServiceName(p.service_id)}</td>
                  <td>{p.cloth_type}</td>
                  <td>₹{p.price}</td>
                  <td>
                    <button className="table-action" onClick={() => openEditPricing(p)} style={{ marginRight: 8 }}>
                      <Pencil size={16} />
                    </button>
                    <button className="table-action" onClick={() => handleDeletePricing(p.price_id)} style={{ color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
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
                {services.map((s) => (
                  <option key={s.service_id} value={s.service_id}>{s.service_name}</option>
                ))}
              </select>
              <label>Cloth Type</label>
              <select value={pClothType} onChange={(e) => setPClothType(e.target.value)} required>
                {clothingTypes.map((ct) => (
                  <option key={ct.type_id} value={ct.type_name}>{ct.type_name}</option>
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
