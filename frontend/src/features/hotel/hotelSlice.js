import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  hotels: [],
  nearbyHotels: [],
  hotel: null,
  newHotelAdded: false,
  hotelReview: null,
  reviews: [],
  featuredPost: null,
  hotelEdited: false,
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

export const editHotel = createAsyncThunk(
  'hotels/editHotel',
  async (hotelDetails) => {
    const config = {
      headers: {
        'Content-Type': 'Application/json',
      },
    };

    const { data } = await axios.post(
      '/api/v1/hotel/edit',
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

export const getReviews = createAsyncThunk(
  'hotels/getReviews',
  async (hotelId) => {
    const { data } = await axios.get(`/api/v1/reviews/${hotelId}`);
    return data;
  }
);

export const getHotel = createAsyncThunk('hotels/getHotel', async (hotelId) => {
  const { data } = await axios.get(`/api/v1/hotel/${hotelId}`);
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

export const getFeaturedPost = createAsyncThunk(
  'hotels/getFeaturedPost',
  async () => {
    const { data } = await axios.get(`api/v1/feature`);
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
    resetNewHotelEditedState: (state) => {
      state.hotelEdited = false;
    },
    resetHotelReviewState: (state) => {
      state.reviews = null;
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
    [editHotel.fulfilled]: (state, { payload }) => {
      return { ...state, hotelEdited: true };
    },
    [addHotelReview.fulfilled]: (state, { payload }) => {
      return { ...state, hotelReview: payload };
    },
    [getReviews.fulfilled]: (state, { payload }) => {
      return { ...state, reviews: payload };
    },
    [getFeaturedPost.fulfilled]: (state, { payload }) => {
      return { ...state, featuredPost: payload };
    },
  },
});

export default hotelSlice.reducer;
export const {
  resetNewHotelAddedState,
  resetHotelReviewState,
  resetNewHotelEditedState,
} = hotelSlice.actions;
