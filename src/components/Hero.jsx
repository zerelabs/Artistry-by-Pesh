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
    if (!triggerRef.current || !pinRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial states for slides 1, 2, 3 (Slide 0 is the starting state)
      gsap.set('.slide-1 .hero-anim-content, .slide-2 .hero-anim-content, .slide-3 .hero-anim-content', { 
        scale: 0.8, 
        autoAlpha: 0 
      });

      const tl = gsap.timeline({
        defaults: { ease: 'none' }, // Fixes "jerky" transitions by removing internal easing curves
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: pinRef.current,
          start: "top top",
          end: "+=300%", // Shorter scroll distance
          scrub: 1, // Faster scrub response
          snap: {
            snapTo: 1 / 3, // Snap exactly to each of the 4 slides
            duration: 0.8,
            delay: 0.1,
            ease: "power2.inOut"
          }
        }
      });

      // We have 4 slides. Transitions are 0->1, 1->2, 2->3.
      // We'll use absolute time values in the timeline: 0, 1, 2 to sequence them evenly.

      // Transition 1 (Slide 0 -> Slide 1)
      tl.to('.slide-0 .hero-character-wrapper', { scale: 5, autoAlpha: 0, duration: 1 }, 0)
        .to('.slide-0 .hero-massive-text', { scale: 2, autoAlpha: 0, duration: 1 }, 0)
        .to('.slide-0 .hero-footer', { autoAlpha: 0, duration: 1 }, 0)
        .to('.slide-0 .slide-bg', { autoAlpha: 0, duration: 1 }, 0)
        // Reveal Slide 1
        .to('.slide-1 .hero-anim-content', { scale: 1, autoAlpha: 1, duration: 1 }, 0);

      // Transition 2 (Slide 1 -> Slide 2)
      tl.to('.slide-1 .hero-character-wrapper', { scale: 5, autoAlpha: 0, duration: 1 }, 1)
        .to('.slide-1 .hero-massive-text', { scale: 2, autoAlpha: 0, duration: 1 }, 1)
        .to('.slide-1 .hero-footer', { autoAlpha: 0, duration: 1 }, 1)
        .to('.slide-1 .slide-bg', { autoAlpha: 0, duration: 1 }, 1)
        // Reveal Slide 2
        .to('.slide-2 .hero-anim-content', { scale: 1, autoAlpha: 1, duration: 1 }, 1);

      // Transition 3 (Slide 2 -> Slide 3)
      tl.to('.slide-2 .hero-character-wrapper', { scale: 5, autoAlpha: 0, duration: 1 }, 2)
        .to('.slide-2 .hero-massive-text', { scale: 2, autoAlpha: 0, duration: 1 }, 2)
        .to('.slide-2 .hero-footer', { autoAlpha: 0, duration: 1 }, 2)
        .to('.slide-2 .slide-bg', { autoAlpha: 0, duration: 1 }, 2)
        // Reveal Slide 3
        .to('.slide-3 .hero-anim-content', { scale: 1, autoAlpha: 1, duration: 1 }, 2);

      // Start the very first video initially
      if (videoRefs.current[0]) {
        videoRefs.current[0].currentTime = 0;
        videoRefs.current[0].play().catch(() => {});
      }

      // Sync video playback with the scroll progress!
      tl.eventCallback("onUpdate", function() {
        const progress = this.progress(); 
        // Math.round means the next video triggers when we are 50% scrolled into it
        let activeIndex = Math.round(progress * (slides.length - 1));
        if (activeIndex >= slides.length) activeIndex = slides.length - 1;

        if (activeSlideRef.current !== activeIndex) {
          // Pause the old video
          const oldVid = videoRefs.current[activeSlideRef.current];
          if (oldVid) oldVid.pause();

          activeSlideRef.current = activeIndex;
          
          // Restart the new video from the beginning and play it
          const newVid = videoRefs.current[activeIndex];
          if (newVid) {
            newVid.currentTime = 0;
            newVid.play().catch(()=>{});
          }
        }
      });

    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={triggerRef} 
      className="hero-trigger" 
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div ref={pinRef} className="hero-pinned-container">
        

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
                  preload={index === 0 ? "auto" : "none"}
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
