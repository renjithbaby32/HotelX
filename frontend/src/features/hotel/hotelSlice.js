import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  hotels: [],
  nearbyHotels: [],
  hotel: null,
  newHotelAdded: false,
  hotelReview: null,
};

export const addHotel = createAsyncThunk(
  'hotels/addHotel',
  async (hotelDetails) => {
    const config = {
      headers: {
        'Content-Type': 'Application/json',
      },
    };

    const { data } = await axios.post(
      '/api/v1/hotel/register',
      hotelDetails,
      config
    );
    return data;
  }
);

export const addHotelReview = createAsyncThunk(
  'hotels/addHotelReview',
  async ({ hotelId, userId, rating, comment = '' }) => {
    const config = {
      headers: {
        'Content-Type': 'Application/json',
      },
    };

    const { data } = await axios.post(
      '/api/v1/reviews',
      {
        hotelId,
        userId,
        rating,
        comment,
      },
      config
    );
    return data;
  }
);

export const getHotels = createAsyncThunk('hotels/getHotels', async () => {
  const { data } = await axios.get('api/v1/hotel/gethotels');
  return data;
});

export const getHotel = createAsyncThunk('hotels/getHotel', async (hotelId) => {
  const { data } = await axios.get(`api/v1/hotel/${hotelId}`);
  return data;
});

export const getNearbyHotels = createAsyncThunk(
  'hotels/get-nearby-hotels',
  async ({ latitude, longitude }) => {
    const { data } = await axios.get(
      `api/v1/hotel/get-nearby-hotels/?latitude=${latitude}&longitude=${longitude}`
    );
    return data;
  }
);

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    resetNewHotelAddedState: (state) => {
      state.newHotelAdded = false;
    },
  },
  extraReducers: {
    [getHotels.pending]: () => {
      console.log('hotels loading');
    },
    [getHotels.fulfilled]: (state, { payload }) => {
      return { ...state, hotels: payload };
    },
    [getNearbyHotels.fulfilled]: (state, { payload }) => {
      return { ...state, nearbyHotels: payload };
    },
    [getHotel.fulfilled]: (state, { payload }) => {
      return { ...state, hotel: payload };
    },
    [addHotel.fulfilled]: (state, { payload }) => {
      return { ...state, newHotelAdded: true };
    },
    [addHotelReview.fulfilled]: (state, { payload }) => {
      return { ...state, hotelReview: payload };
    },
  },
});

export default hotelSlice.reducer;
export const { resetNewHotelAddedState } = hotelSlice.actions;
