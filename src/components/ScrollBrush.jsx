import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '../hooks/useIsMobile';
gsap.registerPlugin(ScrollTrigger);

const ScrollBrush = () => {
  const isMobile = useIsMobile(768);
  const pathRef = useRef(null);
  const canvasRef = useRef(null);
  
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: window.innerWidth,
        height: document.documentElement.scrollHeight
      });
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    const observer = new ResizeObserver(updateSize);
    observer.observe(document.body);
    
    return () => {
      window.removeEventListener('resize', updateSize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (dimensions.height === 0 || dimensions.width === 0) return;
    
    const path = pathRef.current;
    const canvas = canvasRef.current;
    if (!path || !canvas) return;

    const ctx = canvas.getContext('2d');
    const length = path.getTotalLength();
    
    // Set exact physical dimensions for 1:1 crisp rendering
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // High performance segmented drawing algorithm
    const drawTaperedBrush = (progress) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentLength = length * progress;
      if (currentLength <= 0) return;

      const stepSize = 4; // High fidelity
      
      ctx.strokeStyle = '#DC143C';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      let lastPoint = path.getPointAtLength(0);
      
      // Draw thousands of tiny overlapping segments, shrinking the stroke width 
      // from 120px (broad) down to 5px (thin) seamlessly!
      for (let l = stepSize; l <= currentLength; l += stepSize) {
         const t = l / length; 
         const point = path.getPointAtLength(l);
         
         ctx.beginPath();
         ctx.moveTo(lastPoint.x, lastPoint.y);
         ctx.lineTo(point.x, point.y);
         ctx.lineWidth = 375 - (350 * t); 
         ctx.stroke();
         
         lastPoint = point;
      }
      
      if (lastPoint.x) {
         const finalPoint = path.getPointAtLength(currentLength);
         ctx.beginPath();
         ctx.moveTo(lastPoint.x, lastPoint.y);
         ctx.lineTo(finalPoint.x, finalPoint.y);
         ctx.lineWidth = 375 - (350 * progress);
         ctx.stroke();
      }
    };

    // Draw frame 0 initially
    drawTaperedBrush(0);

    const animObj = { progress: 0 };

    const trigger = gsap.to(animObj, {
      progress: 1,
      ease: 'none',
      onUpdate: function() {
        drawTaperedBrush(this.progress());
      },
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });

    return () => {
      if (trigger.scrollTrigger) trigger.scrollTrigger.kill();
      trigger.kill();
    };
  }, [dimensions]);

  if (dimensions.height === 0 || isMobile) return null;

  const w = dimensions.width;
  const h = dimensions.height;
  
  // A beautiful, elegant, multi-curved meandering ribbon shape
  const d = `
    M ${w/2}, 0 
    C ${w*0.7}, ${h*0.15}   ${w*0.8}, ${h*0.25}   ${w*0.6}, ${h*0.35}
    S ${w*0.2}, ${h*0.5}    ${w*0.3}, ${h*0.65}
    S ${w*0.7}, ${h*0.85}   ${w/2}, ${h}
  `;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 2,
      overflow: 'hidden'
    }}>
      {/* Hidden SVG mathematically maps out our beautiful sweeping bezier curves */}
      <svg width={w} height={h} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        <path ref={pathRef} d={d} fill="none" />
      </svg>
      
      {/* Canvas accurately renders the dynamically tapering stroke */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0.5, // The entire stroke sits at a perfect 50% opacity
          filter: 'drop-shadow(0 0 10px rgba(220, 20, 60, 0.5))' // GPU accelerated crimson glow
        }}
      />
    </div>
  );
};

export default ScrollBrush;
