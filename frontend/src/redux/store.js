import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import cartReducer from './slices/cartSlice.js';
import uiReducer from './slices/uiSlice.js';
import wishlistReducer from './slices/wishlistSlice.js';
import { attachInterceptors } from '../services/api.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    wishlist: wishlistReducer,
  },
});

attachInterceptors(store);
