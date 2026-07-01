import React, { useRef } from 'react';
import Hero from '../components/Hero';
import WhyUs from '../components/WhyUs';
import ScrollBrush from '../components/ScrollBrush';

const Home = () => {
  const homeRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!homeRef.current) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    // Set variables for individual elements
    homeRef.current.style.setProperty('--rotY', `${x * 15}deg`);
    homeRef.current.style.setProperty('--rotX', `${y * -15}deg`);
    homeRef.current.style.setProperty('--textRotY', `${x * -5}deg`);
    homeRef.current.style.setProperty('--textRotX', `${y * 5}deg`);
  };

  const handleMouseLeave = () => {
    if (!homeRef.current) return;
    homeRef.current.style.setProperty('--rotY', '0deg');
    homeRef.current.style.setProperty('--rotX', '0deg');
    homeRef.current.style.setProperty('--textRotY', '0deg');
    homeRef.current.style.setProperty('--textRotX', '0deg');
  };

  return (
    <div 
      ref={homeRef}
      className="page-container light-theme" 
      style={{ position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <ScrollBrush />
      <Hero />
      <WhyUs />
    </div>
  );
};

export default Home;
