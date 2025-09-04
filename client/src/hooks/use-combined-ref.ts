import { useCallback, RefObject } from 'react';

export const useCombinedRef = <T>(internalRef: RefObject<T>, externalRef?: React.Ref<T>) => {
  return useCallback(
    (node: T) => {
      if (internalRef.current !== undefined) {
        (internalRef as any).current = node;
      }
      if (typeof externalRef === 'function') {
        externalRef(node);
      } else if (externalRef) {
        (externalRef as RefObject<T>).current = node;
      }
    },
    [internalRef, externalRef],
  );
};
