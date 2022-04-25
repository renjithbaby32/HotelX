import express, { Request, Response, NextFunction } from 'express';
import {
  addFeaturedPost,
  getFeaturedPost,
  payWithRazorpay,
} from '../controllers/feature.controller';

const router = express.Router();

router.route('/').get(getFeaturedPost).post(addFeaturedPost);
router.route('/payment/razorpay').post(payWithRazorpay);

export default router;
