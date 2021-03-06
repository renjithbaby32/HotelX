import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  hotelOwner: localStorage.getItem('hotelOwner')
    ? JSON.parse(localStorage.getItem('hotelOwner'))
    : null,
  OTPSent: false,
  OTPVerified: false,
  OTPVerificationFailed: false,
  upcomingBookings: [],
  checkInDetails: [],
  checkOutDetails: [],
  hotels: [],
  weeklySales: null,
  newBookings: null,
  totalRoomsBooked: null,
  budgetRoomsBooked: null,
  premiumRoomsBooked: null,
  amountPaid: null,
  amountPending: null,
  advertisement: null,
};

export const hotelOwnerLogin = createAsyncThunk(
  'hotelOwners/hotelOwnerLogin',
  async ({ email, password }) => {
    const { data } = await axios.post('/api/v1/hotel-owner/signin', {
      email,
      password,
    });
    return data;
  }
);

export const hotelOwnerRegister = createAsyncThunk(
  'hotelOwners/hotelOwnerRegister',
  async ({ name, phone, email, password }) => {
    const { data } = await axios.post('/api/v1/hotel-owner/signup', {
      name,
      phone,
      email,
      password,
    });
    return data;
  }
);

export const sendOTP = createAsyncThunk(
  'hotelOwners/sendOTP',
  async (phone) => {
    const { data } = await axios.post(`/api/v1/hotel-owner/sendOTP/${phone}`);
    return data;
  }
);

export const verifyOTP = createAsyncThunk(
  'hotelOwners/verifyOTP',
  async ({ phone, code }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/api/v1/hotel-owner/verifyOTP/${phone}`,
        { code }
      );
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

export const getUpComingBookings = createAsyncThunk(
  'hotelOwners/getUpComingBookings',
  async ({ startDate, endDate, hotelId, hotelOwner }) => {
    const { data } = await axios.post(
      `/api/v1/hotel-owner/upcoming-bookings`,
      { startDate, endDate, hotelId },
      {
        headers: {
          Authorization: `Bearer ${hotelOwner.token}`,
        },
      }
    );
    return data;
  }
);

export const getCheckInDetailsOfTheDay = createAsyncThunk(
  'hotelOwners/getBookingDetailsOfTheDay',
  async ({ hotelid, checkInDate, hotelOwner }) => {
    const { data } = await axios.get(
      `/api/v1/booking/checkin/${hotelid}?checkInDate=${checkInDate}`,
      {
        headers: {
          Authorization: `Bearer ${hotelOwner.token}`,
        },
      }
    );
    return data;
  }
);

export const getCheckOutDetailsOfTheDay = createAsyncThunk(
  'hotelOwners/getCheckOutDetailsOfTheDay',
  async ({ hotelid, checkInDate: checkOutDate, hotelOwner }) => {
    const { data } = await axios.get(
      `/api/v1/booking/checkout/${hotelid}?checkOutDate=${checkOutDate}`,
      {
        headers: {
          Authorization: `Bearer ${hotelOwner.token}`,
        },
      }
    );
    return data;
  }
);

export const getHotels = createAsyncThunk(
  'hotelOwners/getHotels',
  async (hotelOwner) => {
    const { data } = await axios.get(
      `/api/v1/hotel-owner/gethotels/${hotelOwner._id}`,
      {
        headers: {
          Authorization: `Bearer ${hotelOwner.token}`,
        },
      }
    );
    return data;
  }
);

export const getWeeklyStats = createAsyncThunk(
  'hotelOwner/getWeeklyStats',
  async ({ startDate, hotelOwnerId }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().hotelOwner.hotelOwner;
      const { data } = await axios.post(
        '/api/v1/hotel-owner/weekly-stats',
        {
          startDate,
          hotelOwnerId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

export const addAdvertisement = createAsyncThunk(
  'hotelOwner/addAdvertisement',
  async (
    { hotel, description, numberOfHits },
    { rejectWithValue, getState }
  ) => {
    try {
      const { token } = getState().hotelOwner.hotelOwner;
      const { data } = await axios.post(
        '/api/v1/feature',
        {
          description,
          numberOfHits,
          hotel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

const hotelOwnerSlice = createSlice({
  name: 'hotelOwner',
  initialState,
  reducers: {
    setHotelOwner: (state) => {
      state.hotelOwner = JSON.parse(localStorage.getItem('hotelOwner'));
    },
    clearHotelOwner: (state) => {
      state.hotelOwner = null;
      localStorage.removeItem('hotelOwner');
    },
    clearAdvertisement: (state) => {
      state.advertisement = null;
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
      return { ...state, OTPVerificationFailed: false, OTPVerified: true };
    },
    [verifyOTP.rejected]: (state, { payload }) => {
      return { ...state, OTPVerificationFailed: true };
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
    [getWeeklyStats.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        newBookings: payload.newBookings,
        weeklySales: payload.weeklySales,
      };
    },
    [addAdvertisement.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        advertisement: payload,
      };
    },
  },
});

export default hotelOwnerSlice.reducer;
export const { setHotelOwner, clearHotelOwner, clearAdvertisement } =
  hotelOwnerSlice.actions;
