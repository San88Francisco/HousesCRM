import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const activeErrorScopes = new Set<string>();

export const useToastOnError = (isError: boolean, message: string, scope: string = message) => {
  const prevErrorRef = useRef<boolean>(false);

  useEffect(() => {
    if (isError && !prevErrorRef.current && !activeErrorScopes.has(scope)) {
      toast.error(message);
      activeErrorScopes.add(scope);
    }

    if (!isError && prevErrorRef.current) {
      activeErrorScopes.delete(scope);
    }

    prevErrorRef.current = isError;
  }, [isError, message, scope]);
};
