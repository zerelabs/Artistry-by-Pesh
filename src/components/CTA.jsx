import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CTA.css';

const CTA = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-content',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'elastic.out(1, 0.7)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Simple swirl animation for the background element
      gsap.to('.cta-swirl', {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'linear'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cta-section" ref={sectionRef} id="contact">
      <div className="cta-swirl"></div>
      
      <div className="container">
        <div className="cta-content">
          <h2 className="text-gradient">Ready to create your masterpiece?</h2>
          <p>Join us for an unforgettable experience. Let your creativity flow.</p>
          
          <div className="cta-buttons">
            <button className="btn-primary">BOOK AN EXPERIENCE</button>
            <button className="btn-secondary">EXPLORE ART STORE</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
