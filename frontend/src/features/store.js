import { configureStore } from '@reduxjs/toolkit';
import userReducer from './users/usersSlice';
import hotelOwnerReducer from './hotelOwners/hotelOwnerSlice';
import userLocationReducer from './userLocation/userLocationSlice';
import hotelReducer from './hotel/hotelSlice';
import bookingReducer from './booking/bookingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    hotelOwner: hotelOwnerReducer,
    hotel: hotelReducer,
    userLocation: userLocationReducer,
    booking: bookingReducer,
  },
});
