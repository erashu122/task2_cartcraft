import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService.js';

const rejectApiError = (error, rejectWithValue) => rejectWithValue(
  error?.response?.data?.message || error.message || 'Cart request failed',
);

export const loadCart = createAsyncThunk('cart/load', async (_, { rejectWithValue }) => {
  try {
    return await cartService.getCart();
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    return await cartService.addItem(productId, quantity);
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    return await cartService.updateItem(itemId, quantity);
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

export const removeCartItem = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    return await cartService.removeItem(itemId);
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    return await cartService.clear();
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

const emptyCart = {
  id: null,
  items: [],
  totalItems: 0,
  subtotal: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: emptyCart,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetCart(state) {
      state.cart = emptyCart;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.status = 'succeeded';
          state.cart = action.payload;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        },
      );
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
