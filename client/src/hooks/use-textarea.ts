import { ChangeEvent, useCallback } from 'react';
import { useFormFieldFocus } from '@/hooks/use-formfield-Focus';
import { useAutoResize } from '@/hooks/use-auto-resize';
import { useCombinedRef } from '@/hooks/use-combined-ref';

type UseTextareaLogicProps = {
  autoResize?: boolean;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  ref?: React.Ref<HTMLTextAreaElement>;
};

export const useTextarea = ({ autoResize = true, onChange, ref }: UseTextareaLogicProps) => {
  const { isFocused, handleFocus, handleBlur } = useFormFieldFocus();
  const { textareaRef, handleInput } = useAutoResize();

  const combinedRef = useCombinedRef(textareaRef, ref);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        handleInput();
      }
      if (onChange) {
        onChange(e);
      }
    },
    [autoResize, handleInput, onChange],
  );

  return {
    isFocused,
    handleFocus,
    handleBlur,
    combinedRef,
    handleChange,
  };
};
