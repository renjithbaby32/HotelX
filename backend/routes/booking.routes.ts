import express, { Request, Response, NextFunction } from 'express';
import {
  checkAvailability,
  bookRooms,
  getBookingDetails,
  payWithRazorpay,
  getCheckInDetailsOfTheDay,
  getCheckOutDetailsOfTheDay,
  checkAvailabilityMain,
} from '../controllers/booking.controller';
import {
  userProtectedRoute,
  hotelOwnerProtectedRoute,
} from '../middleware/authMiddleware';

const router = express.Router();

router.route('/availability/:hotelid').post(checkAvailability);
router.route('/availability').post(checkAvailabilityMain);
router.route('/book/:hotelid').post(userProtectedRoute, bookRooms);
router.route('/:hotelid').get(userProtectedRoute, getBookingDetails);
router
  .route('/checkin/:hotelid')
  .get(hotelOwnerProtectedRoute, getCheckInDetailsOfTheDay);
router
  .route('/checkout/:hotelid')
  .get(hotelOwnerProtectedRoute, getCheckOutDetailsOfTheDay);
router.route('/payment/razorpay').post(userProtectedRoute, payWithRazorpay);

export default router;
