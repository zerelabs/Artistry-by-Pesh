import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import AboutDesktop from './AboutDesktop';
import AboutMobile from './AboutMobile';

const About = () => {
  const isMobile = useIsMobile(900); // Using 900px breakpoint to match AboutDesktop's original media query logic

  if (isMobile) {
    return <AboutMobile />;
  }

  return <AboutDesktop />;
};

export default About;
