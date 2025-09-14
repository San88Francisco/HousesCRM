import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActualTheme, ThemeValue } from '@/types/core/theme';
import {
  getInitialTheme,
  getInitialActualTheme,
  calculateActualTheme,
  applyThemeToDOM,
} from '@/utils/theme';

type ThemeState = {
  theme: ThemeValue;
  actualTheme: ActualTheme;
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
  actualTheme: getInitialActualTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeValue>) => {
      state.theme = action.payload;
      state.actualTheme = calculateActualTheme(action.payload);

      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }

      applyThemeToDOM(state.actualTheme);
    },

    updateAutoTheme: state => {
      if (state.theme === ThemeValue.Auto) {
        const newActualTheme = calculateActualTheme(ThemeValue.Auto);
        if (newActualTheme !== state.actualTheme) {
          state.actualTheme = newActualTheme;
          applyThemeToDOM(newActualTheme);
        }
      }
    },

    initializeTheme: state => {
      applyThemeToDOM(state.actualTheme);
    },
  },
});

export const { setTheme, updateAutoTheme, initializeTheme } = themeSlice.actions;
export default themeSlice.reducer;
