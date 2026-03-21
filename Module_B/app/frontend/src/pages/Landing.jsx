import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShoppingBag, Zap, Clock, Sparkles } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import '../styles/landing.css';

const serviceIcons = {
  'Dry Cleaning': <ShieldCheck size={32} />,
  'Wash & Fold': <ShoppingBag size={32} />,
  'Ironing / Press': <Zap size={32} />,
  'Express Delivery': <Clock size={32} />,
};

const Landing = () => {
  const [services, setServices] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5001/api/landing/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setServices(data.services || []);
        setPricing(data.pricing || []);
      } catch (err) {
        console.error('Landing fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);
  const pricingRef = useRef(null);
  const sectionRefs = useRef([]);

  // Build pricing table data: unique cloth types as rows, services as columns
  const clothTypes = [...new Set(pricing.map((p) => p.cloth_type))];
  const priceLookup = {};
  pricing.forEach((p) => {
    const key = `${p.service_id}__${p.cloth_type}`;
    priceLookup[key] = p.price;
  });

  const scrollToPricing = (e) => {
    e.preventDefault();
    if (pricingRef.current) {
      const navHeight = 80;
      const elementPosition = pricingRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.hero, .services, .pricing, .how-it-works');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <div className="landing-page">
      {/* ── Dynamic Background Elements ── */}
      <div className="bg-blur-blob blob-1"></div>
      <div className="bg-blur-blob blob-2"></div>
      <div className="bg-blur-blob blob-3"></div>

      {/* ── Navigation ── */}
      <nav className="landing-nav">
        <div className="container">
          <span className="logo">FreshWash</span>
          <div className="nav-links">
            <ThemeToggle />
            <Link to="/login" className="nav-btn-link">Login</Link>
            <Link to="/login" state={{ mode: 'signup' }} className="cta-button">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero reveal">
        <div className="container hero-container">
          <div className="hero-content">
            <h1>Premium Laundry Services <span className="text-gradient">Delivered to Your Door</span></h1>
            <p>Experience the most reliable and professional laundry management system. We take&nbsp;the load off your hands so you can focus on what matters.</p>
            <div className="hero-actions">
              <Link to="/login" state={{ mode: 'signup' }} className="primary-btn">Get Started</Link>
              <button onClick={scrollToPricing} className="secondary-btn">Pricing</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="services reveal" id="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive care for all your textile needs.</p>
          </div>
          {loading ? (
            <div className="loading-state">Loading services...</div>
          ) : error ? (
            <div className="error-state">Error: {error}</div>
          ) : (
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
          )}
        </div>
      </section>

      {/* ── Pricing Table ── */}
      <section className="pricing reveal" id="pricing" ref={pricingRef}>
        <div className="container">
          <div className="section-header">
            <h2>Transparent Pricing</h2>
            <p>No hidden charges. See exactly what you pay for each item.</p>
          </div>
          {loading ? (
            <div className="loading-state">Loading pricing details...</div>
          ) : error ? (
            <div className="error-state">Error: {error}</div>
          ) : (
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
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="how-it-works reveal">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Join Us</h4>
              <p>Sign up or log in to access your personal dashboard.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Place Order</h4>
              <p>Choose your services and schedule a convenient pickup.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Processing</h4>
              <p>Our professional employees carefully process your laundry.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Payment</h4>
              <p>Securely handle your payments through our various options.</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <h4>Delivery</h4>
              <p>Get your fresh, clean laundry delivered to your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="logo">FreshWash</span>
              <p>Premium Laundry Management</p>
            </div>
            <div className="footer-divider"></div>
            <p className="footer-copyright">&copy; 2026 FreshWash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
