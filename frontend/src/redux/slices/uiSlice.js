import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage.js';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: storage.get('cartcraft_dark_mode') ?? false,
  },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
      storage.set('cartcraft_dark_mode', state.darkMode);
    },
  },
});

export const { toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
