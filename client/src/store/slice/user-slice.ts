import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  email: string | null;
  username: string | null;
}

const initialState: UserState = {
  email: null,
  username: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ email: string; username?: string }>) => {
      state.email = action.payload.email;
      state.username = action.payload.username || null;
    },
    clearUser: state => {
      state.email = null;
      state.username = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
