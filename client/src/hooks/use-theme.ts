import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { ThemeValue } from '@/types/core/theme';
import { setTheme } from '@/store/slices/themeSlice';
import { selectThemeData } from '@/store/selectors/themeSelectors';
import { useAutoThemeUpdater } from './use-auto-theme-updater';
import { useThemeInitializer } from './use-theme-initializer';

export const useTheme = () => {
  const dispatch = useDispatch();

  const themeData = useSelector(selectThemeData);

  useThemeInitializer();
  useAutoThemeUpdater(themeData.theme);

  const changeTheme = useCallback(
    (newTheme: ThemeValue) => {
      dispatch(setTheme(newTheme));
    },
    [dispatch],
  );

  return useMemo(
    () => ({
      ...themeData,
      changeTheme,
    }),
    [themeData, changeTheme],
  );
};
