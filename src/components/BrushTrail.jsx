import React, { useEffect, useRef } from 'react';

const BrushTrail = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Responsive Canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Mouse Tracking
    let points = [];

    const onMouseMove = (e) => {
      points.push({ 
        x: e.clientX, 
        y: e.clientY, 
        age: 0 
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    // Render Loop
    const render = () => {
      // 1. Fade the canvas using destination-out
      // Lower alpha means slower fade
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw the new segments
      ctx.globalCompositeOperation = 'source-over';
      
      if (points.length > 1) {
        ctx.beginPath();
        // Start at the second oldest point still alive
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          const pt = points[i];
          const prevPt = points[i - 1];
          
          // Smooth curve interpolation
          const xc = (prevPt.x + pt.x) / 2;
          const yc = (prevPt.y + pt.y) / 2;
          
          ctx.quadraticCurveTo(prevPt.x, prevPt.y, xc, yc);
          pt.age += 1;
        }

        // Luxury Gold Brush Styling
        ctx.strokeStyle = '#FFC857';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 12;
        
        // Add a subtle premium glow
        ctx.shadowColor = '#FFC857';
        ctx.shadowBlur = 10;
        
        ctx.stroke();
      }

      // 3. Remove points that have been drawn enough times
      // We only keep a short tail of points to form the current leading curve.
      // The canvas fade handles the trailing decay.
      points = points.filter(p => p.age < 3);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default BrushTrail;
