import { ModalTriggers } from '@/types/model/modals';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ModalState = {
  isOpen: boolean;
  trigger: ModalTriggers | null;
  payload: Record<string, unknown> | null;
};

const initialState: ModalState = { isOpen: false, trigger: null, payload: null };

type OpenPayload = { trigger: ModalTriggers; payload?: Record<string, unknown> };

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, { payload }: PayloadAction<OpenPayload>) {
      state.isOpen = true;
      state.trigger = payload.trigger;
      state.payload = payload.payload ?? null;
    },
    closeModal(state) {
      state.isOpen = false;
      state.trigger = null;
      state.payload = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
