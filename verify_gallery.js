import fs from 'fs';
import path from 'path';

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

let allExist = true;
ARTWORKS.forEach(art => {
  const file = path.join(process.cwd(), 'public', art.url);
  if (!fs.existsSync(file)) {
    console.error('MISSING:', art.url);
    allExist = false;
  }
});

if (allExist) console.log('All images exist!');
