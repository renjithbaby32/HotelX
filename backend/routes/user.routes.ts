import express, { Request, Response, NextFunction } from 'express';
import {
  registerUser,
  authUser,
  getBookings,
  registerUserWithGoogle,
  authUserWithGoogle,
} from '../controllers/user.controller';

const router = express.Router();

router.route('/signup').post(registerUser);
router.route('/signin').post(authUser);
router.route('/signin/google').post(authUserWithGoogle);
router.route('/signup/google').post(registerUserWithGoogle);
router.route('/bookings/:userId').get(getBookings);

export default router;
