import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './ExperiencesPage.css';

const fallbackExperiences = [
  {
    id: 1,
    title: 'Paint & Coffee',
    overline: 'MASTERCLASS',
    description: 'A relaxing morning session blending the rich aromas of coffee with the creative flow of painting.',
    price: '₹1,299',
    image: '/images/experiences/exp_coffee_1782340955733.png',
    accentColor: 'var(--color-sunshine-gold)'
  },
  {
    id: 2,
    title: 'Couple Paint Night',
    overline: 'ROMANCE & ART',
    description: 'An intimate evening designed for two. Create a shared masterpiece while enjoying a romantic, moody atmosphere.',
    price: '₹2,999',
    image: '/images/experiences/exp_couple_1782340967267.png',
    accentColor: 'var(--color-coral-pink)'
  },
  {
    id: 3,
    title: 'Family Art Day',
    overline: 'CONNECT & CREATE',
    description: 'A vibrant, messy, and joyful session where families bond over colors and create lasting memories together.',
    price: '₹4,999',
    image: '/images/experiences/exp_family_1782340980515.png',
    accentColor: 'var(--color-sky-blue)'
  },
  {
    id: 4,
    title: 'Birthday Art Party',
    overline: 'CELEBRATE',
    description: 'Throw the most colorful party of the year. Music, laughter, and a personalized painting experience for you and your friends.',
    price: '₹24,999+',
    image: '/images/experiences/exp_birthday_1782340994906.png',
    accentColor: 'var(--color-lavender)'
  },
  {
    id: 5,
    title: 'Corporate Art Therapy',
    overline: 'TEAM BUILDING',
    description: 'Break the routine. Our corporate sessions are designed to foster team collaboration, relieve stress, and spark innovation.',
    price: '₹29,999+',
    image: '/images/experiences/exp_corporate_1782341007227.png',
    accentColor: 'var(--color-cream-white)'
  },
  {
    id: 6,
    title: 'Kids Creative Club',
    overline: 'LEARN & PLAY',
    description: 'A safe, encouraging space for children to explore primary colors, textures, and their endless imagination.',
    price: '₹999',
    image: '/images/experiences/exp_kids_1782341019209.png',
    accentColor: 'var(--color-sunshine-gold)'
  }
];

export default function ExperiencesPage() {
  const containerRef = useRef(null);
  const [experiences, setExperiences] = useState(fallbackExperiences);

  useEffect(() => {
    // Fetch workshops from Supabase
    const fetchWorkshops = async () => {
      const { data, error } = await supabase.from('workshops').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        // Map database fields to frontend structure
        const mappedData = data.map(w => ({
          id: w.id,
          title: w.title,
          overline: w.overline,
          description: w.description,
          price: `₹${w.price}`,
          image: w.image_url || '/images/experiences/exp_coffee_1782340955733.png',
          accentColor: w.accent_color || 'var(--color-cream-white)',
          availableSeats: w.available_seats,
          totalSeats: w.total_seats
        }));
        setExperiences(mappedData);
      }
    };
    
    fetchWorkshops();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('public:workshops')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workshops' }, payload => {
        fetchWorkshops(); // Re-fetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray('.exp-row');
      
      rows.forEach((row, i) => {
        const textCol = row.querySelector('.exp-text-col');
        const imgCol = row.querySelector('.exp-image-col img');
        
        // Image parallax and fade
        gsap.fromTo(imgCol,
          { opacity: 0, scale: 1.1 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 80%',
            },
            onComplete: () => {
              // Start breathing animation after entrance
              gsap.to(imgCol, {
                scale: 1.05,
                duration: 4,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1
              });
            }
          }
        );

        // Text slide up
        gsap.fromTo(textCol.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 75%',
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="experiences-page page-container" ref={containerRef}>
      
      <div className="exp-list">
        {experiences.map((exp, index) => {
          const isEven = index % 2 === 0;
          return (
            <section key={exp.id} className={`exp-row ${isEven ? 'row-even' : 'row-odd'}`}>
              
              <div className="exp-text-col">
                <div className="exp-text-content">
                  <p className="exp-overline" style={{ color: exp.accentColor }}>{exp.overline}</p>
                  <h2 className="exp-title">{exp.title}</h2>
                  <p className="exp-desc">{exp.description}</p>
                  
                  <div className="exp-details">
                    <p>• All materials provided</p>
                    <p>• Expert guidance</p>
                    <p>• Complimentary beverages</p>
                  </div>
                  
                  <div className="exp-action-row">
                    <Link to={`/booking/${exp.id}`} className="exp-btn">Book Now</Link>
                    <span className="exp-price" style={{ color: exp.accentColor }}>{exp.price}</span>
                  </div>
                </div>
              </div>

              <div className="exp-image-col">
                <div className="img-overlay-left"></div>
                <div className="img-overlay-right"></div>
                <img src={exp.image} alt={exp.title} loading="lazy" />
              </div>

            </section>
          );
        })}
      </div>

    </div>
  );
};


