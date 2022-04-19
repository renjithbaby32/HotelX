import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  admin: null,
  loginError: false,
  weeklySales: null,
  newUsers: null,
  newBookings: null,
  newHotels: null,
  totalRoomsBooked: null,
  budgetRoomsBooked: null,
  premiumRoomsBooked: null,
};

export const adminLogin = createAsyncThunk(
  'users/adminLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/admin/signin', {
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

export const getWeeklyStats = createAsyncThunk(
  'users/getWeeklyStats',
  async (startDate, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/admin/weekly-stats', {
        startDate,
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

export const getMonthlyStats = createAsyncThunk(
  'users/getMonthlyStats',
  async (undefined, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/monthly-stats');
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

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  extraReducers: {
    [adminLogin.pending]: () => {
      console.log('login pending');
    },
    [adminLogin.fulfilled]: (state, { payload }) => {
      localStorage.setItem('admin', JSON.stringify(payload));
      return { ...state, admin: payload, loginError: false };
    },
    [adminLogin.rejected]: (state, { payload }) => {
      return { ...state, loginError: true, loginErrorMessage: payload };
    },
    [getWeeklyStats.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        newUsers: payload.newUsers,
        newBookings: payload.newBookings,
        newHotels: payload.newHotels,
        weeklySales: payload.weeklySales,
      };
    },
    [getMonthlyStats.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        totalRoomsBooked: payload.totalRoomsBooked,
        budgetRoomsBooked: payload.budgetRoomsBooked,
        premiumRoomsBooked: payload.premiumRoomsBooked,
      };
    },
  },
});

export default adminSlice.reducer;
