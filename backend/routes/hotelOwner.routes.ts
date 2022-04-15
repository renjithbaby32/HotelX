import express, { Request, Response, NextFunction } from 'express';
import {
  authHotelOwner,
  registerHotelOwner,
  sendOTP,
  verifyOTP,
  getUpComingBookings,
  getHotels,
} from '../controllers/hotelOwner.controller';
import { hotelOwnerProtectedRoute } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/signin').post(authHotelOwner);
router.route('/signup').post(registerHotelOwner);
router.route('/sendOTP/:phone').post(sendOTP);
router.route('/verifyOTP/:phone').post(verifyOTP);
router
  .route('/upcoming-bookings')
  .post(hotelOwnerProtectedRoute, getUpComingBookings);
router
  .route('/gethotels/:hotelownerid')
  .get(hotelOwnerProtectedRoute, getHotels);

export default router;
