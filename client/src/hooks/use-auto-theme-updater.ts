import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ThemeValue } from '@/types/core/theme';
import { updateAutoTheme } from '@/store/slices/themeSlice';

export const useAutoThemeUpdater = (theme: ThemeValue) => {
  const dispatch = useDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (theme === ThemeValue.Auto) {
      intervalRef.current = setInterval(() => {
        dispatch(updateAutoTheme());
      }, 60000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [theme, dispatch]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
};
