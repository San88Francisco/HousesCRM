import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeTheme } from '@/store/slices/themeSlice';

export const useThemeInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeTheme());
  }, [dispatch]);
};
