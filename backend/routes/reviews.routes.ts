import express, { Request, Response, NextFunction } from 'express';
import { createHotelReview } from '../controllers/reviews.controller';

const router = express.Router();

router.route('/').post(createHotelReview);

export default router;
