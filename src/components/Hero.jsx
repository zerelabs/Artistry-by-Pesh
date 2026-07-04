import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import HeroDesktop from './HeroDesktop';
import HeroMobile from './HeroMobile';

const Hero = () => {
  const isMobile = useIsMobile(768); // Switch to mobile layout if width <= 768px

  if (isMobile) {
    return <HeroMobile />;
  }

  return <HeroDesktop />;
};

export default Hero;
