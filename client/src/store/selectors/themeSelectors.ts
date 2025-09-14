import { createSelector } from '@reduxjs/toolkit';

import { ActualTheme } from '@/types/core/theme';
import { isNightTime } from '@/utils/theme';
import { RootState } from '../store';

export const selectTheme = (state: RootState) => state.theme.theme;
export const selectActualTheme = (state: RootState) => state.theme.actualTheme;

export const selectIsNightTime = createSelector([], () => isNightTime());

export const selectIsDarkMode = createSelector(
  [selectActualTheme],
  actualTheme => actualTheme === ActualTheme.Dark,
);

export const selectThemeData = createSelector(
  [selectTheme, selectActualTheme, selectIsDarkMode],
  (theme, actualTheme, isDarkMode) => ({
    theme,
    actualTheme,
    isDarkMode,
    isNightTime: isNightTime(),
  }),
);
