import { rootApi } from '@/shared/api';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import userReducer from './user-slice';
import modalReducer from './modal-slice';

const store = configureStore({
  reducer: {
    [rootApi.reducerPath]: rootApi.reducer,
    user: userReducer,
    modal: modalReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(rootApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
