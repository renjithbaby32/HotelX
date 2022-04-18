import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useSelector } from 'react-redux';

const initialState = {
  availability: null,
  bookingDetails: null,
  totalAvailability: null,
  dates: null,
};

export const getAvailabilityMain = createAsyncThunk(
  'booking/getAvailabilityMain',
  async ({ startDate, endDate, numberOfDays, numberOfRooms }) => {
    const { data } = await axios.post(
      `http://localhost:5000/api/v1/booking/availability`,
      {
        startDate,
        endDate,
        numberOfDays,
        numberOfRooms,
      }
    );
    return data;
  }
);

export const getAvailability = createAsyncThunk(
  'booking/getAvailability',
  async ({ hotelid, startDate, endDate, numberOfDays }) => {
    const { data } = await axios.post(
      `http://localhost:5000/api/v1/booking/availability/${hotelid}`,
      {
        startDate,
        endDate,
        numberOfDays,
      }
    );
    return data;
  }
);

export const bookRooms = createAsyncThunk(
  'booking/bookRooms',
  async ({
    hotelid,
    startDate,
    endDate,
    amount,
    amountPaid,
    numberOfPremiumRoomsBooked,
    numberOfBudgetRoomsBooked,
    user,
    paymentMethod,
  }) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post(
      `http://localhost:5000/api/v1/booking/book/${hotelid}`,
      {
        startDate,
        endDate,
        amount,
        amountPaid,
        paymentMethod,
        numberOfPremiumRoomsBooked,
        numberOfBudgetRoomsBooked,
      },
      config
    );
    return data;
  }
);

export const getBookingDetails = createAsyncThunk(
  'booking/getBookingDetails',
  async ({ bookingid, user }) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get(
      `http://localhost:5000/api/v1/booking/${bookingid}`,
      config
    );
    return data;
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingDetails: (state) => {
      state.bookingDetails = null;
    },
    clearAvailalbility: (state) => {
      state.availability = null;
    },
    setDates: (state, { payload }) => {
      state.dates = {
        startDate: payload.checkIn,
        endDate: payload.checkOut,
      };
    },
  },
  extraReducers: {
    [getAvailability.pending]: () => {
      console.log('availability loading');
    },
    [getAvailability.fulfilled]: (state, { payload }) => {
      return { ...state, availability: payload };
    },
    [getAvailabilityMain.fulfilled]: (state, { payload }) => {
      return { ...state, totalAvailability: payload };
    },
    [bookRooms.pending]: () => {
      console.log('book rooms loading');
    },
    [bookRooms.fulfilled]: (state, { payload }) => {
      return { ...state, bookingDetails: payload };
    },
    [getBookingDetails.pending]: (state) => {
      return { ...state, loading: true };
    },
    [getBookingDetails.fulfilled]: (state, { payload }) => {
      return { ...state, loading: false, bookingDetails: payload };
    },
    [getBookingDetails.rejected]: (state, { payload }) => {
      return { ...state, loading: false, error: true };
    },
  },
});

export default bookingSlice.reducer;
export const { clearBookingDetails, clearAvailalbility, setDates } =
  bookingSlice.actions;
