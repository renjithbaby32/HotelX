import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  bookings: null,
  loginError: false,
};

export const userLogin = createAsyncThunk(
  'users/userLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/user/signin', {
        email,
        password,
      });
      return data;
    } catch (error) {
      throw rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const userRegister = createAsyncThunk(
  'users/userRegister',
  async ({ name, phone, email, password }) => {
    const { data } = await axios.post('/api/v1/user/signup', {
      name,
      phone,
      email,
      password,
    });
    return data;
  }
);

export const getBookings = createAsyncThunk(
  'users/getBookings',
  async (userId) => {
    const { data } = await axios.get(`/api/v1/user/bookings/${userId}`);
    return data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state) => {
      state.user = JSON.parse(localStorage.getItem('user'));
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: {
    [userLogin.pending]: () => {
      console.log('login pending');
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      localStorage.setItem('user', JSON.stringify(payload));
      return { ...state, user: payload, loginError: false };
    },
    [userLogin.rejected]: (state, { payload }) => {
      return { ...state, loginError: true, loginErrorMessage: payload };
    },
    [userRegister.pending]: () => {
      console.log('signup pending');
    },
    [userRegister.fulfilled]: (state, { payload }) => {
      localStorage.setItem('user', JSON.stringify(payload));
      return { ...state, user: payload };
    },
    [getBookings.pending]: () => {
      console.log('fetching bookings pending');
    },
    [getBookings.fulfilled]: (state, { payload }) => {
      return { ...state, bookings: payload };
    },
  },
});

export default userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;
