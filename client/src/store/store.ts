import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { rootApi } from '@/services/api';
import themeSlice from './slices/themeSlice';

const store = configureStore({
  reducer: {
    [rootApi.reducerPath]: rootApi.reducer,
    theme: themeSlice,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(rootApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
