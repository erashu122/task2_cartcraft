import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '../../services/authService.js';
import { storage } from '../../utils/storage.js';

const savedAuth = storage.get('cartcraft_auth');

const rejectApiError = (error, rejectWithValue) => rejectWithValue(
  error?.response?.data?.message || error.message || 'Request failed',
);

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    return await authService.login(payload);
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return await authService.register(payload);
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

export const loadCurrentUser = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    return await authService.me();
  } catch (error) {
    return rejectApiError(error, rejectWithValue);
  }
});

const persistAuth = (state) => {
  storage.set('cartcraft_auth', { token: state.token, user: state.user });
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedAuth?.user || null,
    token: savedAuth?.token || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCredentials(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      storage.remove('cartcraft_auth');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };
        persistAuth(state);
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };
        persistAuth(state);
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        persistAuth(state);
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message;
        },
      );
  },
});

export const { clearCredentials } = authSlice.actions;
export default authSlice.reducer;
