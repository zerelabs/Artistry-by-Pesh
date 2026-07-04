import { useState, useEffect } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    // Initial check
    checkIsMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [breakpoint]);

  return isMobile;
}
