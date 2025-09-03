import { useEffect, useRef } from 'react';

export const useAutoResize = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.transition = 'none';
      textarea.style.height = 'auto';
      const newHeight = textarea.scrollHeight;

      textarea.style.transition = 'height 0.5s ease';
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.transition = 'height 0.5s ease';
      adjustHeight();
    }
  }, []);

  const handleInput = () => {
    adjustHeight();
  };

  return {
    textareaRef,
    handleInput,
  };
};
