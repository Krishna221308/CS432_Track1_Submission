import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, ShieldCheck, Zap } from 'lucide-react';
import '../styles/landing.css';

const Landing = () => {
  const services = [
    { title: 'Dry Cleaning', desc: 'Expert care for your delicate garments.', icon: <ShieldCheck size={32} /> },
    { title: 'Wash & Fold', desc: 'Everyday laundry cleaned and perfectly folded.', icon: <ShoppingBag size={32} /> },
    { title: 'Ironing Service', desc: 'Crisp, professional press for your shirts and trousers.', icon: <Zap size={32} /> },
    { title: 'Express Delivery', desc: 'Clean laundry back to you in under 24 hours.', icon: <Clock size={32} /> },
  ];

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="container">
          <span className="logo">FreshWash</span>
          <div className="nav-links">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/login" className="cta-button">Join Now</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Premium Laundry Services <span className="text-gradient">Delivered to Your Door</span></h1>
            <p>Experience the most reliable and professional laundry management system. We take the load off your hands so you can focus on what matters.</p>
            <div className="hero-actions">
              <Link to="/login" className="primary-btn">Schedule Your First Wash</Link>
              <button className="secondary-btn">View Pricing</button>
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive care for all your textile needs.</p>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="logo">FreshWash</span>
              <p>Modernizing laundry management.</p>
            </div>
            <div className="footer-links">
              <Link to="/login">Admin Portal</Link>
              <Link to="/login">Employee Login</Link>
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
