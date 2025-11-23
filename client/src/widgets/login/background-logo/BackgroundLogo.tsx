'use client';
import { useIsMobile } from '@/hooks';

export default function BackgroundLogo() {
  const isMobile = useIsMobile();

  if (isMobile) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-[80vw] max-w-[950px] aspect-square bg-logo bg-center bg-contain bg-no-repeat opacity-[0.03]" />
    </div>
  );
}
