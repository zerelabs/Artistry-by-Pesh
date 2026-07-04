import React, { useState, useEffect, useRef } from 'react';
import './HeroMobile.css';

const slides = [
  {
    id: 1,
    name: "CREATE",
    title: "Create",
    desc: "Every masterpiece begins with a single brushstroke. Turn your vision into reality.",
    bgVideo: "/hero/bgs/01_reduced.mp4",
    poster: "/hero/bgs/01_poster.webp",
    img: "/hero/Create.webp"
  },
  {
    id: 2,
    name: "EXPRESS",
    title: "Express",
    desc: "Turn emotions into beautiful memories. Let your colors flow freely and authentically.",
    bgVideo: "/hero/bgs/02_reduced.mp4",
    poster: "/hero/bgs/02_poster.webp",
    img: "/hero/Express.webp"
  },
  {
    id: 3,
    name: "ENJOY",
    title: "Enjoy",
    desc: "Celebrate creativity together. A place where art becomes a shared experience.",
    bgVideo: "/hero/bgs/03_reduced.mp4",
    poster: "/hero/bgs/03_poster.webp",
    img: "/hero/Enjoy.webp"
  }
];

const StopMotionImageMobile = () => {
  const [stopMotionIdx, setStopMotionIdx] = useState(0);
  const stopMotionImages = [
    "/stopmotion/hf_20260620_175328_863b0046-d185-4683-be5c-bca254aa0e1e.webp",
    "/stopmotion/hf_20260620_180357_da1d57c2-c9b9-4914-874b-e293537bf9f6.webp",
    "/stopmotion/hf_20260620_180508_526c1f15-f5d2-4cb0-a7f4-7c4a0dadfef2.webp",
    "/stopmotion/hf_20260620_180517_c54fab3d-e391-43db-9e33-c2bfe64a86bd.webp",
    "/stopmotion/hf_20260620_181714_db40987f-c565-4eb2-935d-8c3dd7447c88.webp"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStopMotionIdx(prev => (prev + 1) % stopMotionImages.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return <img src={stopMotionImages[stopMotionIdx]} alt="Stop motion" className="mobile-stopmotion-img" />;
};

const HeroMobile = () => {
  return (
    <div className="hero-mobile-container">
      {slides.map((slide, index) => (
        <section key={slide.id} className="hero-mobile-slide">
          <div className="mobile-bg-wrapper">
            {slide.bgVideo && (
              <video 
                className="mobile-bg-video"
                loop 
                muted 
                playsInline
                autoPlay
                poster={slide.poster}
                src={slide.bgVideo}
              />
            )}
          </div>
          
          <div className="mobile-content-wrapper">
            <h1 className="mobile-massive-text">{slide.name}</h1>
            <div className="mobile-character-container">
              <img src={slide.img} alt={slide.title} className="mobile-character-img" fetchPriority={index === 0 ? "high" : "auto"} />
            </div>
            <div className="mobile-footer">
              <h2>{slide.title}</h2>
              <p>{slide.desc}</p>
            </div>
          </div>
        </section>
      ))}

      {/* Final Slide */}
      <section className="hero-mobile-slide final-mobile-slide">
        <div className="mobile-final-content">
          <h2 className="mobile-final-heading">
            <span className="text-create">CREATE.</span>
            <span className="text-express">Express.</span>
            <span className="text-enjoy">Enjoy.</span>
          </h2>
          <p className="mobile-final-subtext">
            A place where <span className="script-pink">creativity</span><br/>
            becomes a <span className="script-blue">memory</span>.
          </p>
          <div className="mobile-final-buttons">
            <a href="/experiences" className="mobile-btn-book">Book Experience &rarr;</a>
            <a href="/gallery" className="mobile-btn-gallery">Explore Gallery &rarr;</a>
          </div>
        </div>
        <div className="mobile-final-portrait">
          <StopMotionImageMobile />
        </div>
      </section>
    </div>
  );
};

export default HeroMobile;
