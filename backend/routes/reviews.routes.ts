import express, { Request, Response, NextFunction } from 'express';
import {
  createHotelReview,
  getReviews,
} from '../controllers/reviews.controller';

const router = express.Router();

router.route('/').post(createHotelReview);
router.route('/:hotelId').get(getReviews);

export default router;
