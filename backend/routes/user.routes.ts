import express, { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  authUser,
  getBookings,
} from '../controllers/user.controller';

const router = express.Router();

router.route('/signin').post(authUser);
router.route('/signup').post(registerUser);
router.route('/bookings/:userId').get(getBookings);

export default router;
