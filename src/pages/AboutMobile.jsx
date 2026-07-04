import React from 'react';
import './AboutMobile.css';

const AboutMobile = () => {
  return (
    <div className="about-mobile-page">
      <div className="mobile-space-dust-bg"></div>

      <div className="mobile-about-content">
        <div className="mobile-about-header-spacing"></div>

        {/* Hero Video */}
        <div className="mobile-about-hero-video-container">
          <video 
            className="mobile-about-hero-video" 
            src="/images/about/about_page_video_new.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
          />
        </div>

        {/* Tree Divider */}
        <div className="mobile-about-tree-divider">
          <img src="/images/about/tree_branch.png?v=2" alt="Decorative tree branch" className="mobile-tree-branch-img" />
          <video 
            className="mobile-tree-butterflies-video"
            src="/images/about/butterflies_loop_optimized.webm?v=1" 
            autoPlay 
            loop 
            muted 
            playsInline
          />
        </div>

        {/* Simplified Cards */}
        <div className="mobile-about-cards-container">
          
          {/* Card 1 */}
          <div className="mobile-card">
            <div className="mobile-card-glow cyan"></div>
            <img src="/images/about/about_hero_double_exp_1782682654446.png" className="mobile-card-img" alt="Artistic Double Exposure" />
            <div className="mobile-card-text">
              <h1>The Canvas<br/>Awaits</h1>
              <p>Every masterpiece begins as a whisper—a single drop of ink, a stroke of a brush, a moment of courage before a blank canvas.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="mobile-card">
            <div className="mobile-card-glow purple"></div>
            <img src="/images/about/pesh-profile_optimized.webp" className="mobile-card-img" alt="Founder Portrait" />
            <div className="mobile-card-text">
              <h2>The Studio</h2>
              <p>We stripped away the intimidating galleries and strict techniques to create a sanctuary where expression takes precedence over perfection.</p>
              <div className="mobile-signature">Pesh</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="mobile-card">
            <div className="mobile-card-glow gold"></div>
            <img src="/images/about/about_fingerprint_art_1782682674575.png" className="mobile-card-img" alt="Fingerprint Art" />
            <div className="mobile-card-text center-text">
              <h2>Your Signature</h2>
              <p>Discover the dormant artist within you without fear of judgment. Let your emotions flow freely. Every brushstroke is a word, every color a sentence.</p>
            </div>
          </div>

        </div>

        {/* Bottom Full Canvas Video */}
        <div className="mobile-about-bottom-video-section">
          <video 
            className="mobile-bottom-full-canvas-video"
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

export default AboutMobile;
