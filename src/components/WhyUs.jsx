import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WhyUs.css';

const PaintSparkles = () => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Generate random sparkles on mount to prevent hydration mismatches
    const generated = Array.from({ length: 40 }).map(() => ({
      size: Math.random() * 8 + 4,
      color: ['#FFC857', '#FF5C7A', '#5BC0EB', '#A970FF'][Math.floor(Math.random() * 4)],
      left: Math.random() * 100,
      top: Math.random() * 100,
      animDuration: Math.random() * 3 + 2,
      animDelay: Math.random() * 2,
      depth: Math.random() * 200 - 100
    }));
    setSparkles(generated);
  }, []);

  return (
    <div className="sparkles-container">
      {sparkles.map((s, i) => (
        <div 
          key={i} 
          className="paint-sparkle"
          style={{
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
            boxShadow: `0 0 10px ${s.color}`,
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDuration: `${s.animDuration}s`,
            animationDelay: `${s.animDelay}s`,
            transform: `translateZ(${s.depth}px)`
          }}
        />
      ))}
    </div>
  );
};

const WhyUs = () => {
  const sectionRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.why-title', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      gsap.fromTo(itemsRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: '.why-grid',
            start: 'top 80%',
          }
        }
      );

      // Quote animation
      gsap.fromTo('.quote-container',
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.quote-container',
            start: 'top 70%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { title: 'No Experience Needed', text: 'Come as you are. We guide you step-by-step.', color: 'var(--color-sky-blue)' },
    { title: 'Premium Materials', text: 'High-quality paints and canvases provided.', color: 'var(--color-sunshine-gold)' },
    { title: 'Fun, Relaxed & Pressure-Free', text: 'Sip, chat, and paint at your own pace.', color: 'var(--color-coral-pink)' },
    { title: 'Memories That Last', text: 'Take home a masterpiece and a great story.', color: 'var(--color-lavender)' }
  ];

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    // Calculate rotation (-10deg to 10deg)
    const rotX = (y - 0.5) * -20; 
    const rotY = (x - 0.5) * 20;

    sectionRef.current.style.setProperty('--rotX', `${rotX}deg`);
    sectionRef.current.style.setProperty('--rotY', `${rotY}deg`);
  };

  const handleMouseLeave = () => {
    if (!sectionRef.current) return;
    sectionRef.current.style.setProperty('--rotX', `0deg`);
    sectionRef.current.style.setProperty('--rotY', `0deg`);
  };

  return (
    <section 
      className="why-us" 
      ref={sectionRef} 
      id="about"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <PaintSparkles />
      
      <div className="container why-container">
        <h2 className="why-title text-center text-gradient">Why Choose Artistry by Pesh?</h2>
        
        <div className="why-grid">
          {features.map((item, i) => (
            <div 
              key={i} 
              className="why-item" 
              ref={el => itemsRef.current[i] = el}
            >
              <div className="why-orb" style={{ background: item.color, boxShadow: `0 0 30px ${item.color}80` }}></div>
              <div className="why-content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="quote-container">
          <div className="quote-brush-bg"></div>
          <blockquote>
            <span className="quote-mark">"</span>
            Every canvas begins with a simple moment of courage.
            <span className="quote-mark">"</span>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
