import { createSlice } from '@reduxjs/toolkit';

const cachedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const cachedToken = localStorage.getItem('accessToken') || null;

const initialState = {
  user: cachedUser,
  token: cachedToken,
  isAuthenticated: !!cachedToken,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logoutSuccess(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    clearError(state) {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setError,
  loginSuccess,
  logoutSuccess,
  updateUser,
  clearError
} = authSlice.actions;

export default authSlice.reducer;
