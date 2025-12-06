import { useEffect, useState } from 'react';

const TABLET_BREAKPOINT = 1024;
const MOBILE_BREAKPOINT = 768;
const SMALL_MOBILE_BREAKPOINT = 480;

type UseResponsiveResult = {
  isMobile: boolean;
  isTablet: boolean;
  isSmallMobile: boolean;
};

export const useIsMobile = (): UseResponsiveResult => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  const [isSmallMobile, setIsSmallMobile] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;

      setIsSmallMobile(width < SMALL_MOBILE_BREAKPOINT);
      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return { isMobile, isTablet, isSmallMobile };
};
