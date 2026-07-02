import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    id: 1,
    name: "CREATE",
    title: "Create",
    desc: "Every masterpiece begins with a single brushstroke. Turn your vision into reality.",
    bgVideo: "/hero/bgs/01_opt.mp4",
    poster: "/hero/bgs/01_poster.webp",
    img: "/hero/Create.webp"
  },
  {
    id: 2,
    name: "EXPRESS",
    title: "Express",
    desc: "Turn emotions into beautiful memories. Let your colors flow freely and authentically.",
    bgVideo: "/hero/bgs/02_opt.mp4",
    poster: "/hero/bgs/02_poster.webp",
    img: "/hero/Express.webp"
  },
  {
    id: 3,
    name: "ENJOY",
    title: "Enjoy",
    desc: "Celebrate creativity together. A place where art becomes a shared experience.",
    bgVideo: "/hero/bgs/03.mp4",
    poster: "/hero/bgs/03_poster.webp",
    img: "/hero/Enjoy.webp"
  },
  {
    id: 4,
    name: "FINAL",
    bgColor: "transparent",
    isCustomLayout: true
  }
];

const StopMotionImage = () => {
  const [stopMotionIdx, setStopMotionIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);
  
  const stopMotionImages = [
    "/stopmotion/hf_20260620_175328_863b0046-d185-4683-be5c-bca254aa0e1e.webp",
    "/stopmotion/hf_20260620_180357_da1d57c2-c9b9-4914-874b-e293537bf9f6.webp",
    "/stopmotion/hf_20260620_180508_526c1f15-f5d2-4cb0-a7f4-7c4a0dadfef2.webp",
    "/stopmotion/hf_20260620_180517_c54fab3d-e391-43db-9e33-c2bfe64a86bd.webp",
    "/stopmotion/hf_20260620_181714_db40987f-c565-4eb2-935d-8c3dd7447c88.webp"
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setStopMotionIdx(prev => (prev + 1) % stopMotionImages.length);
    }, 400);
    return () => clearInterval(interval);
  }, [isVisible]);

  return <img ref={imgRef} src={stopMotionImages[stopMotionIdx]} alt="Stop motion frame" className="stopmotion-img" loading="lazy" />;
};

const Hero = () => {
  const triggerRef = useRef(null);
  const pinRef = useRef(null);
  const videoRefs = useRef([]);
  const activeSlideRef = useRef(0);

  useEffect(() => {
    if (!triggerRef.current) return;

    // We will use standard React state to track active slide, 
    // but GSAP to animate the DOM directly for maximum performance.
    
    // Set initial styles
    gsap.set('.slide-1 .hero-anim-content, .slide-2 .hero-anim-content, .slide-3 .hero-anim-content', { 
      scale: 0.8, 
      autoAlpha: 0 
    });
    
    // All background videos except the first one should be hidden initially
    gsap.set('.slide-1 .slide-bg, .slide-2 .slide-bg, .slide-3 .slide-bg', { 
      autoAlpha: 0 
    });

    let currentIndex = 0;
    let isAnimating = false;

    // Helper to transition slides
    const gotoSlide = (newIndex) => {
      if (isAnimating) return;
      if (newIndex < 0 || newIndex >= slides.length) {
        // If we try to scroll past the last slide, unpin and let the page scroll normally
        if (newIndex >= slides.length) {
          document.body.style.overflow = 'auto'; // Release scroll lock
        }
        return;
      }
      
      isAnimating = true;
      const oldIndex = currentIndex;
      currentIndex = newIndex;

      // Play new video, pause old
      if (videoRefs.current[oldIndex]) videoRefs.current[oldIndex].pause();
      if (videoRefs.current[newIndex]) {
        videoRefs.current[newIndex].currentTime = 0;
        videoRefs.current[newIndex].play().catch(()=>{});
      }

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating = false;
        }
      });

      // 1. Crossfade the backgrounds
      tl.to(`.slide-${oldIndex} .slide-bg`, { autoAlpha: 0, duration: 1, ease: 'power2.inOut' }, 0);
      tl.to(`.slide-${newIndex} .slide-bg`, { autoAlpha: 1, duration: 1, ease: 'power2.inOut' }, 0);

      // 2. Animate out the old content (Epic Zoom Out)
      tl.to(`.slide-${oldIndex} .hero-character-wrapper`, { scale: 5, autoAlpha: 0, duration: 1, ease: 'power2.inOut' }, 0);
      tl.to(`.slide-${oldIndex} .hero-massive-text`, { scale: 2, autoAlpha: 0, duration: 1, ease: 'power2.inOut' }, 0);
      tl.to(`.slide-${oldIndex} .hero-footer`, { autoAlpha: 0, duration: 1, ease: 'power2.inOut' }, 0);
      
      // If the old slide was the custom final slide, fade it out
      if (slides[oldIndex].isCustomLayout) {
         tl.to(`.slide-${oldIndex} .hero-anim-content`, { autoAlpha: 0, scale: 2, duration: 1, ease: 'power2.inOut' }, 0);
      }

      // 3. Animate in the new content
      tl.fromTo(`.slide-${newIndex} .hero-anim-content`, 
        { scale: 0.8, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1, ease: 'power2.out' }, 
        0.2 // slight delay so it comes in after the zoom starts
      );
    };

    // Initial video play
    if (videoRefs.current[0]) {
      videoRefs.current[0].currentTime = 0;
      videoRefs.current[0].play().catch(() => {});
    }

    // Register and create GSAP Observer for cross-device support (wheel, touch, pointer)
    const observer = gsap.core.globals().Observer || gsap.plugins.Observer;
    // Actually, ScrollTrigger has a built-in observe method!
    const intentObserver = ScrollTrigger.observe({
      target: window,
      type: "wheel,touch,pointer",
      preventDefault: false, // We'll handle this manually
      onChange: (self) => {
        if (window.scrollY <= 10) {
          
          if (currentIndex < slides.length - 1 || (currentIndex === slides.length - 1 && self.deltaY < 0)) {
            document.body.style.overflow = 'hidden'; 
          }

          if (self.deltaY > 20) {
            gotoSlide(currentIndex + 1);
          } else if (self.deltaY < -20) {
            gotoSlide(currentIndex - 1);
          }
        } else if (self.deltaY < 0 && window.scrollY <= 20) {
          document.body.style.overflow = 'hidden';
          gotoSlide(slides.length - 1);
        }
      }
    });

    return () => {
      intentObserver.kill();
      document.body.style.overflow = 'auto'; 
    };
  }, []);

  return (
    <section 
      ref={triggerRef} 
      className="hero-trigger" 
      style={{ position: 'relative', zIndex: 1, height: '100vh', overflow: 'hidden' }}
    >
      <div className="hero-pinned-container" style={{ height: '100%' }}>
        

      {/* Stacked Slides */}
      <div className="hero-slides-wrapper">
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`hero-slide slide-${index}`} 
            style={{ 
              zIndex: slides.length - index,
              backgroundColor: slide.bgColor || 'transparent'
            }}
          >
            {/* The background layer (animated by GSAP) */}
            <div className="slide-bg" style={{ backgroundColor: slide.bgColor || 'transparent', overflow: 'hidden' }}>
              {slide.bgVideo && (
                <video 
                  ref={el => videoRefs.current[index] = el}
                  className="slide-bg-video"
                  loop 
                  muted 
                  playsInline
                  preload="auto"
                  poster={slide.poster}
                  src={slide.bgVideo}
                />
              )}
            </div>

            {/* The animated content wrapper */}
            <div className="hero-anim-content">
              {slide.isCustomLayout ? (
                <div className="custom-final-slide">
                  <div className="final-left final-typography-block">
                    <h2 className="final-heading">
                      <span className="text-create">CREATE.</span>
                      <span className="text-express">Express.</span>
                      <span className="text-enjoy">Enjoy.</span>
                    </h2>
                    <p className="final-subtext">
                      A place where <span className="script-pink">creativity</span><br/>
                      becomes a <span className="script-blue">memory</span>.
                    </p>
                    <div className="final-buttons">
                      <a href="/experiences" className="btn-book">Book Experience &rarr;</a>
                      <a href="/gallery" className="btn-gallery">Explore Gallery &rarr;</a>
                    </div>
                  </div>
                  <div className="final-right">
                    <div className="portrait-placeholder">
                      <StopMotionImage />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="hero-slider-content">
                    {/* Background Text Layer */}
                    <div className="hero-massive-text-wrapper">
                      <h1 className="hero-massive-text">
                        {slide.name}
                      </h1>
                    </div>
                    <div className="hero-character-wrapper">
                      <img 
                        src={slide.img} 
                        alt={slide.title} 
                        className="hero-character-img"
                        fetchPriority={index === 0 ? "high" : "auto"}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  </div>

                  <footer className="hero-footer">
                    <div className="footer-left">
                      <h2>{slide.title}</h2>
                      <p>{slide.desc}</p>
                    </div>
                  </footer>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default Hero;
