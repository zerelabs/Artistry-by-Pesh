import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const fallbackExperiences = [
  {
    title: 'Paint & Coffee',
    overline: 'MASTERCLASS',
    description: 'A relaxing morning session blending the rich aromas of coffee with the creative flow of painting.',
    price: 1299,
    image_url: '/images/experiences/exp_coffee_1782340955733.png',
    accent_color: 'var(--color-sunshine-gold)',
    total_seats: 10,
    available_seats: 10
  },
  {
    title: 'Couple Paint Night',
    overline: 'ROMANCE & ART',
    description: 'An intimate evening designed for two. Create a shared masterpiece while enjoying a romantic, moody atmosphere.',
    price: 2999,
    image_url: '/images/experiences/exp_couple_1782340967267.png',
    accent_color: 'var(--color-coral-pink)',
    total_seats: 8,
    available_seats: 8
  },
  {
    title: 'Family Art Day',
    overline: 'CONNECT & CREATE',
    description: 'A vibrant, messy, and joyful session where families bond over colors and create lasting memories together.',
    price: 4999,
    image_url: '/images/experiences/exp_family_1782340980515.png',
    accent_color: 'var(--color-sky-blue)',
    total_seats: 15,
    available_seats: 15
  },
  {
    title: 'Birthday Art Party',
    overline: 'CELEBRATE',
    description: 'Throw the most colorful party of the year. Music, laughter, and a personalized painting experience for you and your friends.',
    price: 24999,
    image_url: '/images/experiences/exp_birthday_1782340994906.png',
    accent_color: 'var(--color-lavender)',
    total_seats: 20,
    available_seats: 20
  },
  {
    title: 'Corporate Art Therapy',
    overline: 'TEAM BUILDING',
    description: 'Break the routine. Our corporate sessions are designed to foster team collaboration, relieve stress, and spark innovation.',
    price: 29999,
    image_url: '/images/experiences/exp_corporate_1782341007227.png',
    accent_color: 'var(--color-cream-white)',
    total_seats: 30,
    available_seats: 30
  },
  {
    title: 'Kids Creative Club',
    overline: 'LEARN & PLAY',
    description: 'A safe, encouraging space for children to explore primary colors, textures, and their endless imagination.',
    price: 999,
    image_url: '/images/experiences/exp_kids_1782341019209.png',
    accent_color: 'var(--color-sunshine-gold)',
    total_seats: 12,
    available_seats: 12
  }
];

async function seed() {
  const { data: existing, error: err } = await supabase.from('workshops').select('id');
  
  if (existing && existing.length > 0) {
    console.log('Workshops already exist in DB. Clearing them first...');
    for (const w of existing) {
      await supabase.from('workshops').delete().eq('id', w.id);
    }
  }

  console.log('Inserting default workshops...');
  const { data, error } = await supabase.from('workshops').insert(fallbackExperiences).select();
  
  if (error) {
    console.error('Error inserting:', error);
  } else {
    console.log('Successfully inserted', data.length, 'workshops!');
  }
}

seed();
