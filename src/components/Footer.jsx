import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-glow-bg"></div>
      
      <div className="footer-container">
        
        {/* Top Call to Action */}
        <div className="footer-cta">
          <h2 className="footer-cta-title">Ready to create a <span className="text-gradient">masterpiece?</span></h2>
          <Link to="/experiences" className="footer-cta-btn">Book an Experience</Link>
        </div>

        <div className="footer-divider"></div>

        {/* Main Footer Links */}
        <div className="footer-main">
          <div className="footer-brand-section">
            <h3 className="footer-brand-name">Artistry by Pesh</h3>
            <p className="footer-brand-desc">
              A sanctuary where expression takes precedence over perfection. We guide you step-by-step to discover the dormant artist within you.
            </p>
          </div>

          <div className="footer-links-section">
            <h4 className="footer-col-title">Explore</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About the Studio</Link></li>
              <li><Link to="/experiences">Experiences</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div className="footer-contact-section">
            <h4 className="footer-col-title">Connect</h4>
            <ul className="footer-links-list">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
            <p className="footer-email">hello@artistrybypesh.com</p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Artistry by Pesh. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
