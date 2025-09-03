import { useState } from 'react';

export const useFormFieldFocus = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return {
    isFocused,
    handleFocus,
    handleBlur,
  };
};
