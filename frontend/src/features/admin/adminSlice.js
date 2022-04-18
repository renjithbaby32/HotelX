import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  admin: null,
  loginError: false,
};

export const adminLogin = createAsyncThunk(
  'users/adminLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/v1/admin/signin',
        { email, password }
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
  },
});

export default adminSlice.reducer;
