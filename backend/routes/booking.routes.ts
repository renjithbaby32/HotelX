import express, { Request, Response, NextFunction } from 'express';
import {
  checkAvailability,
  bookRooms,
  getBookingDetails,
  payWithRazorpay,
  getCheckInDetailsOfTheDay,
  getCheckOutDetailsOfTheDay,
} from '../controllers/booking.controller';
import { userProtectedRoute } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/availability/:hotelid').post(checkAvailability);
router.route('/book/:hotelid').post(userProtectedRoute, bookRooms);
router.route('/:hotelid').get(userProtectedRoute, getBookingDetails);
router.route('/checkin/:hotelid').get(getCheckInDetailsOfTheDay);
router.route('/checkout/:hotelid').get(getCheckOutDetailsOfTheDay);
router.route('/payment/razorpay').post(payWithRazorpay);

export default router;
