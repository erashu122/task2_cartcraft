import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService.js';

const rejectApiError = (error, rejectWithValue) => rejectWithValue(
  error?.response?.data?.message || error.message || 'Wishlist request failed',
);

export const loadWishlist = createAsyncThunk('wishlist/load', async (_, { rejectWithValue }) => {
  try {
    return await wishlistService.getWishlist();
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
  try {
    return await wishlistService.add(productId);
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    return await wishlistService.remove(productId);
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    resetWishlist(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('wishlist/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        },
      );
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
