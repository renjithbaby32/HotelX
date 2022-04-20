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
  amountPaid: null,
  amountPending: null,
  users: null,
  hotels: null,
  hotelOwners: null,
  userBlockedOrUnblocked: false,
  hotelBlockedOrUnblocked: false,
  hotelOwnerBlockedOrUnblocked: false,
  salesReport: null,
};

export const adminLogin = createAsyncThunk(
  'admin/adminLogin',
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

export const getSalesReport = createAsyncThunk(
  'admin/getSalesReport',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/admin/salesreport', {
        startDate,
        endDate,
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
  'admin/getWeeklyStats',
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
  'admin/getMonthlyStats',
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

export const getSettlementStats = createAsyncThunk(
  'admin/getSettlementStats',
  async (undefined, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/settlement-stats');
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

export const getUserList = createAsyncThunk(
  'admin/getUserList',
  async (undefined, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/userlist');
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

export const getHotels = createAsyncThunk(
  'admin/getHotels',
  async (undefined, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/hotelslist');
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

export const getHotelOwnersList = createAsyncThunk(
  'admin/getHotelOwnersList',
  async (undefined, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/v1/admin/hotel-owners-list');
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

export const blockOrUnblockUser = createAsyncThunk(
  'admin/blockOrUnblockUser',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/api/v1/admin/user/block-unblock/${userId}`
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

export const blockOrUnblockHotel = createAsyncThunk(
  'admin/blockOrUnblockHotel',
  async (hotelId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/api/v1/admin/hotel/block-unblock/${hotelId}`
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

export const blockOrUnblockHotelOwner = createAsyncThunk(
  'admin/blockOrUnblockHotelOwner',
  async (hotelOwnerId, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `/api/v1/admin/hotel-owner/block-unblock/${hotelOwnerId}`
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
    [getSalesReport.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        salesReport: payload,
      };
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
    [getSettlementStats.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        amountPaid: payload.amountPaid,
        amountPending: payload.amountPending,
      };
    },
    [getUserList.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        users: payload,
      };
    },
    [getHotels.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        hotels: payload,
      };
    },
    [blockOrUnblockUser.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        userBlockedOrUnblocked: !state.userBlockedOrUnblocked,
      };
    },
    [blockOrUnblockHotel.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        hotelBlockedOrUnblocked: !state.hotelBlockedOrUnblocked,
      };
    },
    [blockOrUnblockHotelOwner.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        hotelOwnerBlockedOrUnblocked: !state.hotelOwnerBlockedOrUnblocked,
      };
    },
    [getHotelOwnersList.fulfilled]: (state, { payload }) => {
      return {
        ...state,
        hotelOwners: payload,
      };
    },
  },
});

export default adminSlice.reducer;
