import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Heart, Users, Cake, Briefcase, Palette } from 'lucide-react';
import './Experiences.css';

const experiencesData = [
  {
    id: 1,
    title: 'Couple Paint Night',
    icon: <Heart size={32} color="var(--color-coral-pink)" />,
    description: 'Connect and create memories together. A perfect date night filled with color and laughter.',
    color: 'var(--color-coral-pink)'
  },
  {
    id: 2,
    title: 'Family Experience',
    icon: <Users size={32} color="var(--color-sky-blue)" />,
    description: 'Messy hands, full hearts. A playful session designed for all ages to bond over art.',
    color: 'var(--color-sky-blue)'
  },
  {
    id: 3,
    title: 'Birthday Art Party',
    icon: <Cake size={32} color="var(--color-lavender)" />,
    description: 'Celebrate another trip around the sun with friends, drinks, and your own masterpiece.',
    color: 'var(--color-lavender)'
  },
  {
    id: 4,
    title: 'Corporate Workshops',
    icon: <Briefcase size={32} color="var(--color-sunshine-gold)" />,
    description: 'Team building that actually builds. Unleash collective creativity outside the office.',
    color: 'var(--color-sunshine-gold)'
  },
  {
    id: 5,
    title: 'Painting Experiences',
    icon: <Palette size={32} color="var(--color-cream-white)" />,
    description: 'Guided or unguided sessions for solo artists looking to unwind and express themselves.',
    color: 'var(--color-cream-white)'
  }
];

const Experiences = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.exp-header', 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      gsap.fromTo(cardsRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.exp-grid',
            start: 'top 85%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="experiences" ref={sectionRef} id="experiences">
      <div className="container">
        <div className="exp-header text-center">
          <h2 className="text-gradient">Experiences for Everyone</h2>
          <p>Explore joyful experiences designed for every moment and every creator.</p>
        </div>

        <div className="exp-grid">
          {experiencesData.map((exp, index) => (
            <div 
              key={exp.id} 
              className="exp-card"
              ref={el => cardsRef.current[index] = el}
              style={{ '--hover-color': exp.color }}
            >
              <div className="exp-card-inner">
                <div className="exp-icon-wrapper" style={{ borderColor: exp.color, boxShadow: `0 0 20px ${exp.color}40` }}>
                  {exp.icon}
                </div>
                <h3>{exp.title}</h3>
                <p>{exp.description}</p>
                <Link to="/experiences" style={{textDecoration: 'none'}}>
                  <button className="exp-explore">Explore Sessions</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
