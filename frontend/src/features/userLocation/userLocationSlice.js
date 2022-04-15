import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  location: {},
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    addLocationToLocalStorage: (state, { payload }) => {
      state.location = {
        latitude: payload.latitude,
        longitude: payload.longitude,
      };
    },
  },
});

export const { addLocationToLocalStorage } = locationSlice.actions;

export default locationSlice.reducer;
