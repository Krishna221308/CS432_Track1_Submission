import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, Zap, Clock, Sparkles, Truck, CheckCircle } from 'lucide-react';
import { getServices, getPricing } from '../utils/mockData';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/landing.css';

const serviceIcons = {
  'Dry Cleaning': <ShieldCheck size={32} />,
  'Wash & Fold': <ShoppingBag size={32} />,
  'Ironing / Press': <Zap size={32} />,
  'Express Delivery': <Clock size={32} />,
};

const Landing = () => {
  const services = getServices();
  const pricing = getPricing();

  // Build pricing table data: unique cloth types as rows, services as columns
  const clothTypes = [...new Set(pricing.map((p) => p.cloth_type))];
  const priceLookup = {};
  pricing.forEach((p) => {
    const key = `${p.service_id}__${p.cloth_type}`;
    priceLookup[key] = p.price;
  });

  return (
    <div className="landing-page">
      {/* ── Navigation ── */}
      <nav className="landing-nav">
        <div className="container">
          <span className="logo">FreshWash</span>
          <div className="nav-links">
            <Link to="/login" className="login-link">Login</Link>
            <ThemeToggle />
            <Link to="/login" state={{ mode: 'signup' }} className="cta-button">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Premium Laundry Services <span className="text-gradient">Delivered to Your Door</span></h1>
            <p>Experience the most reliable and professional laundry management system. We take&nbsp;the load off your hands so you can focus on what matters.</p>
            <div className="hero-actions">
              <Link to="/login" state={{ mode: 'signup' }} className="primary-btn">Get Started Free</Link>
              <a href="#pricing" className="secondary-btn">View Pricing</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive care for all your textile needs.</p>
          </div>
          <div className="services-grid">
            {services.map((s) => (
              <div key={s.service_id} className="service-card">
                <div className="service-icon">
                  {serviceIcons[s.service_name] || <Sparkles size={32} />}
                </div>
                <h3>{s.service_name}</h3>
                <p>{s.service_description}</p>
                <div className="service-price">
                  Starting at <strong>₹{s.base_price}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Table ── */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Transparent Pricing</h2>
            <p>No hidden charges. See exactly what you pay for each item.</p>
          </div>
          <div className="pricing-table-wrapper">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Clothing Type</th>
                  {services.map((s) => (
                    <th key={s.service_id}>{s.service_name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clothTypes.map((ct) => (
                  <tr key={ct}>
                    <td className="cloth-type-cell">{ct}</td>
                    {services.map((s) => {
                      const price = priceLookup[`${s.service_id}__${ct}`];
                      return (
                        <td key={s.service_id}>
                          {price !== undefined ? `₹${price}` : <span className="na">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Schedule</h4>
              <p>Book a pickup online or via our app.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Pickup</h4>
              <p>We collect your laundry from your doorstep.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Clean</h4>
              <p>Our experts clean and fold your items.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Delivery</h4>
              <p>We deliver it back, fresh and clean.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo">FreshWash</span>
              <p>Modernizing laundry management.</p>
            </div>
            <div className="footer-links">
              <Link to="/login">Support</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 FreshWash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
