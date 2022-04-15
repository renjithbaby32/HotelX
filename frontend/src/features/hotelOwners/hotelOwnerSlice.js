import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  hotelOwner: null,
  OTPSent: false,
  OTPVerified: false,
  upcomingBookings: [],
  checkInDetails: [],
  checkOutDetails: [],
  hotels: [],
};

export const hotelOwnerLogin = createAsyncThunk(
  'hotelOwners/hotelOwnerLogin',
  async ({ email, password }) => {
    const { data } = await axios.post(
      'http://localhost:5000/api/v1/hotel-owner/signin',
      { email, password }
    );
    return data;
  }
);

export const hotelOwnerRegister = createAsyncThunk(
  'hotelOwners/hotelOwnerRegister',
  async ({ name, phone, email, password }) => {
    const { data } = await axios.post(
      'http://localhost:5000/api/v1/hotel-owner/signup',
      { name, phone, email, password }
    );
    return data;
  }
);

export const sendOTP = createAsyncThunk(
  'hotelOwners/sendOTP',
  async (phone) => {
    const { data } = await axios.post(
      `http://localhost:5000/api/v1/hotel-owner/sendOTP/${phone}`
    );
    return data;
  }
);

export const verifyOTP = createAsyncThunk(
  'hotelOwners/verifyOTP',
  async ({ phone, code }) => {
    const { data } = await axios.post(
      `http://localhost:5000/api/v1/hotel-owner/verifyOTP/${phone}`,
      { code }
    );
    return data;
  }
);

export const getUpComingBookings = createAsyncThunk(
  'hotelOwners/getUpComingBookings',
  async ({ startDate, endDate, hotelId }) => {
    const { data } = await axios.post(
      `http://localhost:5000/api/v1/hotel-owner/upcoming-bookings`,
      { startDate, endDate, hotelId }
    );
    return data;
  }
);

export const getCheckInDetailsOfTheDay = createAsyncThunk(
  'hotelOwners/getBookingDetailsOfTheDay',
  async ({ hotelid, checkInDate }) => {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/booking/checkin/${hotelid}?checkInDate=${checkInDate}`
    );
    return data;
  }
);

export const getCheckOutDetailsOfTheDay = createAsyncThunk(
  'hotelOwners/getCheckOutDetailsOfTheDay',
  async ({ hotelid, checkInDate: checkOutDate }) => {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/booking/checkout/${hotelid}?checkOutDate=${checkOutDate}`
    );
    return data;
  }
);

export const getHotels = createAsyncThunk(
  'hotelOwners/getHotels',
  async (hotelOwnerId) => {
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/hotel-owner/gethotels/${hotelOwnerId}`
    );
    return data;
  }
);

const hotelOwnerSlice = createSlice({
  name: 'hotelOwner',
  initialState,
  reducers: {
    setHotelOwner: (state) => {
      state.hotelOwner = JSON.parse(localStorage.getItem('hotelOwner'));
    },
    clearHotelOwner: (state) => {
      state.hotelOwner = null;
    },
  },
  extraReducers: {
    [hotelOwnerLogin.pending]: () => {
      console.log('login pending');
    },
    [hotelOwnerLogin.fulfilled]: (state, { payload }) => {
      localStorage.setItem('hotelOwner', JSON.stringify(payload));
      return { ...state, hotelOwner: payload };
    },
    [hotelOwnerRegister.pending]: () => {
      console.log('signup pending');
    },
    [hotelOwnerRegister.fulfilled]: (state, { payload }) => {
      localStorage.setItem('hotelOwner', JSON.stringify(payload));
      return { ...state, hotelOwner: payload };
    },
    [sendOTP.fulfilled]: (state, { payload }) => {
      return { ...state, OTPSent: true };
    },
    [verifyOTP.fulfilled]: (state, { payload }) => {
      return { ...state, OTPVerified: true };
    },
    [getUpComingBookings.fulfilled]: (state, { payload }) => {
      return { ...state, upcomingBookings: payload };
    },
    [getCheckInDetailsOfTheDay.fulfilled]: (state, { payload }) => {
      return { ...state, checkInDetails: payload };
    },
    [getCheckOutDetailsOfTheDay.fulfilled]: (state, { payload }) => {
      return { ...state, checkOutDetails: payload };
    },
    [getHotels.fulfilled]: (state, { payload }) => {
      return { ...state, hotels: payload };
    },
  },
});

export default hotelOwnerSlice.reducer;
export const { setHotelOwner, clearHotelOwner } = hotelOwnerSlice.actions;
