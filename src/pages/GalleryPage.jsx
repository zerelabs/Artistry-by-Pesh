import React from 'react';
import Gallery from '../components/Gallery';

const GalleryPage = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1 }}>
      {/* We use a fixed full-screen container for the 3D Canvas */}
      <Gallery />
    </div>
  );
};

export default GalleryPage;
