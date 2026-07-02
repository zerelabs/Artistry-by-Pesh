import React, { useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, ScrollControls, useScroll, Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// --- PHASE 1 ARTWORKS ---
const ARTWORKS = [
  // WORLD 01: Abstract Collection
  { url: '/images/gallery/luxury/abs_1_1782347740115.png', z: 0, x: -1.5, y: 0.5, title: "Abstract Burst" },
  { url: '/images/gallery/luxury/abs_2_1782347752797.png', z: -5, x: 2, y: -0.5, title: "Neon Motion" },
  { url: '/images/gallery/luxury/abs_3_1782347763872.png', z: -10, x: -2, y: -1, title: "Geometric Primary" },

  // WORLD 02: Nature Collection
  { url: '/images/gallery/gal_1_1782344900718.png', z: -15, x: 1.5, y: 1, title: "Botanical Daydream" },
  { url: '/images/gallery/gal_2_1782344912674.png', z: -20, x: -1, y: -1.5, title: "Golden Bloom" },
  { url: '/images/gallery/gal_3_1782344924463.png', z: -25, x: 2.5, y: 0, title: "Misty Sunrise" },

  // WORLD 03: Emotion Collection
  { url: '/images/gallery/luxury/exp_couple_1782340967267.png', z: -30, x: -2.5, y: 1.5, title: "In The Rain" },
  { url: '/images/gallery/luxury/exp_family_1782340980515.png', z: -35, x: 1, y: -0.5, title: "Tender Light" },
  { url: '/images/gallery/luxury/exp_kids_1782341019209.png', z: -40, x: -1.5, y: 0.5, title: "Childhood Wonder" },

  // WORLD 04: Signature Collection
  { url: '/images/gallery/gal_4_1782344938193.png', z: -45, x: 2, y: -0.5, title: "The Masterpiece" },
  { url: '/images/gallery/gal_5_1782344951238.png', z: -50, x: -2, y: -1, title: "Golden Sculpture" },
  { url: '/images/gallery/gal_7_1782344975213.png', z: -55, x: 1.5, y: 1, title: "Epic Finale" }
];

// --- PHASE 2 PLACEHOLDERS (18 items, 4 per row) ---
const GAP = 1.5;
const IMG_WIDTH = 3.0;

const ROW_CONFIG = [
  { ratio: 4/5, height: IMG_WIDTH * (5/4) },   // Row 0: 4:5 Portrait
  { ratio: 1/1, height: IMG_WIDTH * 1.0 },     // Row 1: 1:1 Square
  { ratio: 16/9, height: IMG_WIDTH * (9/16) }, // Row 2: 16:9 Landscape
  { ratio: 4/5, height: IMG_WIDTH * (5/4) },   // Row 3: 4:5 Portrait
  { ratio: 1/1, height: IMG_WIDTH * 1.0 }      // Row 4: 1:1 Square (Last row, 2 items)
];

let currentY = -4;
const rowYCenters = [];
for (let i = 0; i < ROW_CONFIG.length; i++) {
  const h = ROW_CONFIG[i].height;
  rowYCenters.push(currentY - (h / 2));
  currentY -= (h + GAP); // Increased gap between rows
}

const PLACEHOLDERS = Array.from({ length: 18 }).map((_, i) => {
  const row = Math.floor(i / 4); // 4 per row
  const col = i % 4;
  
  // Calculate how many items are actually in this row (to center the last row of 2)
  const itemsInRow = Math.min(4, 18 - row * 4);
  
  // X dynamically centered based on 4 items per row and the increased GAP
  const xSpacing = IMG_WIDTH + GAP;
  const x = (col - (itemsInRow - 1) / 2) * xSpacing;
  
  const y = rowYCenters[row];
  const z = -75;
  const height = ROW_CONFIG[row].height;
  
  // Re-use existing images since quota is exhausted
  const url = ARTWORKS[i % ARTWORKS.length].url;
  
  return { id: i + 1, x, y, z, width: IMG_WIDTH, height, url };
});

// Phase 1 Component (Preserved as is)
const FramedArtwork = ({ url, z, x, y, title, onSelect }) => {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const texture = useTexture(url);
  
  const aspect = texture.image.width / texture.image.height;
  
  // Increased by 50%
  const maxImgWidth = 2.7;
  const maxImgHeight = 3.9;

  let imgWidth = maxImgWidth;
  let imgHeight = maxImgWidth / aspect;

  if (imgHeight > maxImgHeight) {
    imgHeight = maxImgHeight;
    imgWidth = maxImgHeight * aspect;
  }

  useFrame(() => {
    if (ref.current) {
      const targetZ = hovered ? z + 0.8 : z;
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetZ, 0.1);
      const targetRotX = hovered ? 0.05 : 0;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.1);
    }
  });

  return (
    <Float floatIntensity={1} rotationIntensity={0.2} speed={1.5} floatingRange={[-0.05, 0.05]}>
      <group 
        position={[x, y, z]} 
        ref={ref} 
        onClick={(e) => { e.stopPropagation(); onSelect({ url, title }); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }} 
        onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
      >
        
        <pointLight position={[0, 1.5, 2]} intensity={hovered ? 8 : 4} distance={6} color="#ffebc2" decay={2} />
        {hovered && <pointLight position={[0, 0, -0.5]} intensity={3} distance={4} color="#FFC857" />}
        
        <mesh position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[imgWidth, imgHeight]} />
          <meshBasicMaterial map={texture} />
        </mesh>

        <Text
          position={[0, -imgHeight / 2 - 0.25, 0]}
          fontSize={0.15 * 1.5}
          color="#FFF8F0"
          anchorX="center"
          anchorY="top"
          opacity={hovered ? 1 : 0.6}
        >
          {title}
        </Text>
        
        <Text
          position={[0, -imgHeight / 2 - 0.65, 0]}
          fontSize={0.08 * 1.5}
          color="#FFC857"
          anchorX="center"
          anchorY="top"
          opacity={hovered ? 1 : 0}
          letterSpacing={0.2}
        >
          VIEW STORY
        </Text>
      </group>
    </Float>
  );
};

// Phase 2 Component - STRICT GRID (No floating, no overlapping)
const PlaceholderArtwork = ({ id, x, y, z, width, height, url, onSelect }) => {
  const ref = useRef();
  const [hovered, setHover] = useState(false);
  const texture = useTexture(url);
  const title = `Artwork ${id}`;

  // Apply object-fit: cover logic to texture so it doesn't squish on different aspect ratios
  const clonedTexture = useMemo(() => {
    const tex = texture.clone();
    tex.needsUpdate = true;
    const imgAspect = texture.image.width / texture.image.height;
    const planeAspect = width / height;
    
    const repeatX = imgAspect > planeAspect ? planeAspect / imgAspect : 1;
    const repeatY = imgAspect > planeAspect ? 1 : imgAspect / planeAspect;
    
    tex.repeat.set(repeatX, repeatY);
    tex.offset.set((1 - repeatX) / 2, (1 - repeatY) / 2);
    return tex;
  }, [texture, width, height]);

  useFrame(() => {
    if (ref.current) {
      // Very slight hover effect, but strictly locked to grid on X and Y
      const targetZ = hovered ? z + 0.5 : z;
      ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetZ, 0.1);
    }
  });

  return (
    <group 
      position={[x, y, z]} 
      ref={ref} 
      onClick={(e) => { e.stopPropagation(); onSelect({ url, title }); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }} 
      onPointerOut={() => { setHover(false); document.body.style.cursor = 'auto'; }}
    >
      
      <pointLight position={[0, 1.5, 2]} intensity={hovered ? 8 : 4} distance={6} color="#ffebc2" decay={2} />
      {hovered && <pointLight position={[0, 0, -0.5]} intensity={3} distance={4} color="#FFC857" />}
      
      {/* Filled Canvas */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={clonedTexture} />
      </mesh>

      <Text
        position={[0, -height / 2 - 0.25, 0]}
        fontSize={0.15 * 1.5}
        color="#FFF8F0"
        anchorX="center"
        anchorY="top"
        opacity={hovered ? 1 : 0.6}
      >
        {title}
      </Text>
      
      <Text
        position={[0, -height / 2 - 0.65, 0]}
        fontSize={0.08 * 1.5}
        color="#FFC857"
        anchorX="center"
        anchorY="top"
        opacity={hovered ? 1 : 0}
        letterSpacing={0.2}
      >
        VIEW STORY
      </Text>
    </group>
  );
};

// Magical Floating Particles
const EnvironmentParticles = () => {
  const count = 2000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      p[i] = (Math.random() - 0.5) * 30; // X spread (wider for grid)
      p[i+1] = (Math.random() - 0.5) * 40 - 15; // Y spread (covers descent)
      p[i+2] = (Math.random() - 1) * 85; // Z depth (0 to -85)
    }
    return p;
  }, [count]);

  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#FFC857" 
        transparent 
        opacity={0.3} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// --- 2-PHASE CAMERA CONTROLLER ---
const CameraRig = () => {
  const scroll = useScroll();
  const { camera, mouse } = useThree();

  useFrame(() => {
    // Phase 1: 0 to 0.5 scroll (Z-flight)
    const phase1 = Math.min(scroll.offset / 0.5, 1);
    
    // Phase 2: 0.5 to 1.0 scroll (Y-descent)
    const phase2 = Math.max(0, (scroll.offset - 0.5) / 0.5);

    // Z movement happens in Phase 1 (fly from 0 to -65)
    const targetZ = phase1 * -65;
    
    // Y movement happens in Phase 2 (descend from 0 to -30)
    const targetYBase = phase2 * -30;
    
    const isMobile = window.innerWidth < 768;
    const baseZ = isMobile ? 12 : 5; // Pull back further on mobile so portraits fit

    // Smooth camera movement
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ + baseZ, 0.1);
    
    // Parallax
    const targetX = (mouse.x * 2);
    const targetYParallax = (mouse.y * 2);
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetYBase + targetYParallax, 0.05);
    
    // Look ahead and down slightly
    camera.lookAt(0, targetYBase, camera.position.z - 10);
  });

  return null;
};

// Loading component using Html to avoid suspending inside a Suspense fallback
const Loader = () => (
  <Html center>
    <div style={{ 
      color: '#FFC857', 
      fontSize: '1.2rem', 
      whiteSpace: 'nowrap', 
      fontFamily: 'sans-serif',
      letterSpacing: '2px',
      textTransform: 'uppercase'
    }}>
      Preparing Gallery Experience...
    </div>
  </Html>
);

const Gallery = () => {
  const [selectedArt, setSelectedArt] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(20px); }
        }
        .gallery-bg-container {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: #030303;
          z-index: -1;
          overflow: hidden;
        }
        .floating-planet {
          position: absolute;
          width: 300px;
          height: auto;
          mix-blend-mode: screen;
          opacity: 0.9;
          filter: blur(0px);
          animation: floatPlanet 20s infinite ease-in-out alternate;
        }
        @keyframes floatPlanet {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(40px, -50px) scale(1.1) rotate(15deg); }
          100% { transform: translate(-30px, 40px) scale(0.9) rotate(-10deg); }
        }
      `}</style>

      {/* Floating Background Elements */}
      <div className="gallery-bg-container">
        <video className="floating-planet" src="/images/gallery/bg-icons/3d-animated-paint-brush-with-liquid-paint-2026-02-18-10-46-06-utc.webm" autoPlay loop muted playsInline style={{ top: '10%', left: '15%', animationDelay: '0s' }} />
        <video className="floating-planet" src="/images/gallery/bg-icons/3d-animation-of-canvas-painting-expresses-creativi-2026-01-28-05-21-33-utc.webm" autoPlay loop muted playsInline style={{ top: '60%', left: '80%', animationDelay: '-5s', width: '350px' }} />
        <video className="floating-planet" src="/images/gallery/bg-icons/3d-animation-of-creating-the-perfect-color-palette-2026-02-18-04-46-26-utc.webm" autoPlay loop muted playsInline style={{ top: '80%', left: '20%', animationDelay: '-12s' }} />
        <video className="floating-planet" src="/images/gallery/bg-icons/Paint Explosion.webm" autoPlay loop muted playsInline style={{ top: '30%', left: '70%', animationDelay: '-8s', width: '250px' }} />
        <video className="floating-planet" src="/images/gallery/bg-icons/paint-tube-3d-animation-alpha-channel-2026-02-18-05-23-55-utc.webm" autoPlay loop muted playsInline style={{ top: '45%', left: '5%', animationDelay: '-15s', width: '320px' }} />
        <video className="floating-planet" src="/images/gallery/bg-icons/vibrant-abstract-fluid-shapes-morphing-animation-2026-02-18-15-04-33-utc.webm" autoPlay loop muted playsInline style={{ top: '15%', left: '50%', animationDelay: '-2s', width: '280px' }} />
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.15} />
        
        <EnvironmentParticles />
        
        <Suspense fallback={<Loader />}>
          {/* Increased pages to 10 to give enough scroll space for both phases */}
          <ScrollControls pages={10} damping={0.2}>
            <CameraRig />
            
            {/* Phase 1 Artworks */}
            {ARTWORKS.map((art, i) => (
              <FramedArtwork key={`art-${i}`} {...art} onSelect={setSelectedArt} />
            ))}

            {/* Phase 2 Placeholders */}
            {PLACEHOLDERS.map((placeholder) => (
              <PlaceholderArtwork key={`ph-${placeholder.id}`} {...placeholder} onSelect={setSelectedArt} />
            ))}
            
            {/* Transition Text between Phase 1 and Phase 2 */}
            <group position={[0, 0, -70]}>
              <pointLight intensity={2} distance={8} color="#FFC857" />
              <Text
                position={[0, 0.6, 0]}
                fontSize={0.5}
                color="#FFF8F0"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.05}
              >
                This is more than ART.
              </Text>
              <Text
                position={[0, -0.2, 0]}
                fontSize={0.3}
                color="#FFC857"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.1}
                material-toneMapped={false}
              >
                This is Your Happy Space.
              </Text>
            </group>

            {/* Intro Text */}
            <group position={[0, 0, 3]}>
              <pointLight intensity={2} distance={3} color="#FFC857" />
              <Text
                fontSize={0.2}
                color="#FFC857"
                letterSpacing={0.1}
                material-toneMapped={false}
              >
                Scroll to Explore
              </Text>
            </group>
            
            {/* Note: "Your Canvas Awaits" outro text removed as requested */}
          </ScrollControls>
        </Suspense>
      </Canvas>

      {/* LUXURY LIGHTBOX OVERLAY */}
      {selectedArt && (
        <div 
          onClick={() => setSelectedArt(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <img 
            src={selectedArt.url} 
            alt={selectedArt.title}
            style={{
              maxHeight: '75vh',
              maxWidth: '90vw',
              objectFit: 'contain',
              boxShadow: '0 30px 60px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '4px'
            }}
          />
          <h2 style={{
            color: '#FFC857',
            marginTop: '2.5rem',
            fontFamily: 'sans-serif',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontWeight: 300,
            fontSize: '1.2rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {selectedArt.title}
          </h2>
          <div style={{
            position: 'absolute',
            top: '2.5rem',
            right: '3.5rem',
            color: '#ffffff',
            fontSize: '0.9rem',
            letterSpacing: '2px',
            opacity: 0.4,
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(255,255,255,0.4)',
            paddingBottom: '4px'
          }}>
            Close
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
