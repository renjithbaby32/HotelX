import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  bookings: null,
};

export const userLogin = createAsyncThunk(
  'users/userLogin',
  async ({ email, password }) => {
    const { data } = await axios.post(
      'http://localhost:5000/api/v1/user/signin',
      { email, password }
    );
    return data;
  }
);

export const userRegister = createAsyncThunk(
  'users/userRegister',
  async ({ name, phone, email, password }) => {
    const { data } = await axios.post(
      'http://localhost:5000/api/v1/user/signup',
      { name, phone, email, password }
    );
    return data;
  }
);

export const getBookings = createAsyncThunk(
  'users/getBookings',
  async (userId) => {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/user/bookings/${userId}`
    );
    return data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reduxcers: {
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
      return { ...state, user: payload };
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
