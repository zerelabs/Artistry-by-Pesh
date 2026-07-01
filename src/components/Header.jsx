import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLightMode = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${isLightMode ? 'header-light' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <img src="/images/logo_optimized.png" alt="Artistry by Pesh" className="header-logo-img" />
        </Link>
        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>About</NavLink>
          <NavLink to="/experiences" className={({ isActive }) => (isActive ? 'active' : '')}>Experiences</NavLink>
          <NavLink to="/events" className={({ isActive }) => (isActive ? 'active' : '')}>Events</NavLink>
          <NavLink to="/store" className={({ isActive }) => (isActive ? 'active' : '')}>Store</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active' : '')}>Gallery</NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'active' : '')}>Blog</NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
