import { useEffect, useRef, useCallback } from 'react';

export const useAutoResize = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initialHeightRef = useRef<number>(0);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.transition = 'none';
      textarea.style.height = 'auto';

      const contentHeight = textarea.scrollHeight;

      const newHeight = Math.max(contentHeight, initialHeightRef.current);

      textarea.style.transition = 'height 0.2s ease';
      textarea.style.height = `${newHeight}px`;
      textarea.style.minHeight = `${initialHeightRef.current}px`;
    }
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.transition = 'height 0.2s ease';

      textarea.style.height = 'auto';
      const initialHeight = textarea.scrollHeight;
      initialHeightRef.current = initialHeight;
      textarea.style.height = `${initialHeight}px`;
      textarea.style.minHeight = `${initialHeight}px`;

      const handleManualResize = () => {
        const currentHeight = textarea.offsetHeight;
        const contentHeight = textarea.scrollHeight;

        const minAllowedHeight = Math.max(contentHeight, initialHeightRef.current);
        if (currentHeight < minAllowedHeight) {
          textarea.style.height = `${minAllowedHeight}px`;
        }
      };

      const resizeObserver = new ResizeObserver(handleManualResize);
      resizeObserver.observe(textarea);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  const handleInput = useCallback(() => {
    adjustHeight();
  }, [adjustHeight]);

  return {
    textareaRef,
    handleInput,
  };
};
