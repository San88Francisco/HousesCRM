import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const useToastOnError = (isError: boolean, message: string) => {
  const prevErrorRef = useRef<boolean>(false);

  useEffect(() => {
    if (isError && !prevErrorRef.current) {
      toast.error(message);
    }

    prevErrorRef.current = isError;
  }, [isError, message]);
};
