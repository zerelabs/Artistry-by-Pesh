import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

// Reusable 3D Tilt Card Component
const TiltCard = ({ children, className }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    
    // Tilt the card
    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto"
    });
    
    // Extra parallax shift for the art and text inside
    const art = cardRef.current.querySelector('.pop-out-art');
    const text = cardRef.current.querySelector('.pop-out-text');
    
    if (art) gsap.to(art, { x: -rotateY * 3, y: rotateX * 3, duration: 0.5 });
    if (text) gsap.to(text, { x: rotateY * 2, y: -rotateX * 2, duration: 0.5 });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 1, ease: "power3.out" });
    
    const art = cardRef.current.querySelector('.pop-out-art');
    const text = cardRef.current.querySelector('.pop-out-text');
    if (art) gsap.to(art, { x: 0, y: 0, duration: 1 });
    if (text) gsap.to(text, { x: 0, y: 0, duration: 1 });
  };

  return (
    <div 
      className={`tilt-card-wrapper ${className}`} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
    >
      <div className="tilt-card-inner" ref={cardRef}>
        {children}
      </div>
    </div>
  );
};

const About = () => {
  const containerRef = useRef(null);
  const butterflyVideoRef = useRef(null);

  // Slow down the butterfly video for a dreamy effect
  useEffect(() => {
    if (butterflyVideoRef.current) {
      butterflyVideoRef.current.playbackRate = 0.5; // Half speed
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in each card as you scroll down the page
      gsap.utils.toArray('.tilt-card-wrapper').forEach((card) => {
        gsap.fromTo(card,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%", // Triggers when top of card hits 80% down viewport
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="about-normal-scroll-page" ref={containerRef}>
      
      {/* Background Atmosphere */}
      <div className="space-dust-bg"></div>

      {/* Foreground Content Wrapper to guarantee it sits above the background video */}
      <div style={{ position: 'relative' }}>
        <div className="about-header-spacing"></div>

        <div className="about-hero-video-container">
          <video 
            className="about-hero-video" 
            src="/images/about/about_page_video_new.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
          />
        </div>

      {/* Decorative Tree overlapping the bottom edge */}
      <div className="about-tree-divider">
        <img src="/images/about/tree_branch.png?v=2" alt="Decorative tree branch" className="tree-branch-img" />
        <video 
          ref={butterflyVideoRef}
          className="tree-butterflies-video"
          src="/images/about/butterflies_loop_optimized.webm?v=1" 
          autoPlay 
          loop 
          muted 
          playsInline
        />
      </div>

      <div className="about-cards-container">
        
        {/* Card 1 */}
        <TiltCard className="panel-1">
          <div className="card-bg-glow cyan"></div>
          <img src="/images/about/about_hero_double_exp_1782682654446.png" className="pop-out-art img-left" alt="Artistic Double Exposure" />
          <div className="card-content pop-out-text right-align">
            <h1>The Canvas<br/>Awaits</h1>
            <p>Every masterpiece begins as a whisper—a single drop of ink, a stroke of a brush, a moment of courage before a blank canvas.</p>
          </div>
        </TiltCard>

        {/* Card 2 */}
        <TiltCard className="panel-2 reverse-layout">
          <div className="card-bg-glow purple"></div>
          <img src="/images/about/pesh-profile_optimized.webp" className="pop-out-art img-right" alt="Founder Portrait" />
          <div className="card-content pop-out-text left-align">
            <h2>The Studio</h2>
            <p>We stripped away the intimidating galleries and strict techniques to create a sanctuary where expression takes precedence over perfection.</p>
            <div className="signature">Pesh</div>
          </div>
        </TiltCard>

        {/* Card 3 */}
        <TiltCard className="panel-3 centered-layout">
          <div className="card-bg-glow gold"></div>
          <img src="/images/about/about_fingerprint_art_1782682674575.png" className="pop-out-art img-center" alt="Fingerprint Art" />
          <div className="card-content pop-out-text center-align">
            <h2>Your Signature</h2>
            <p>Discover the dormant artist within you without fear of judgment. Let your emotions flow freely. Every brushstroke is a word, every color a sentence.</p>
          </div>
        </TiltCard>

      </div>
      
      {/* Bottom Full Canvas Video */}
      <div className="about-bottom-video-section">
        <video 
          className="bottom-full-canvas-video"
          src="/images/about/paint-splatter-transparent_optimized.webm"
          autoPlay 
          loop 
          muted 
          playsInline
        />
      </div>

      </div>
    </div>
  );
};

export default About;
