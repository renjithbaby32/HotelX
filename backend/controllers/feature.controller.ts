import asyncHandler from 'express-async-handler';
import Feature from '../models/feature.model';
import shortid from 'shortid';
import { razorpay } from '../config/razorpay.config';

/**
 * @api {get} /api/v1/feature/
 * @apiName GetFeaturePost
 */

export const getFeaturedPost = asyncHandler(async (req, res) => {
  const featuredPost = await Feature.find({
    numberOfHits: { $gt: 0 },
  })
    .populate('hotel', 'name mainImage')
    .sort({
      numberOfHits: -1,
    })
    .limit(1);

  if (featuredPost) {
    featuredPost[0].numberOfHits = featuredPost[0].numberOfHits - 1;
    await featuredPost[0].save();
    res.status(200).json(featuredPost[0]);
  } else {
    res.status(400);
    throw new Error('Someting went wrong');
  }
});

/**
 * @api {post} /api/v1/feature/
 * @apiName AddFeaturePost
 */

export const addFeaturedPost = asyncHandler(async (req, res) => {
  const { description, hotel, numberOfHits } = req.body;
  const newFeature = await Feature.create({
    description,
    hotel,
    numberOfHits,
  });
  if (newFeature) {
    res.status(201).json(newFeature);
  } else {
    res.status(400);
    throw new Error('Someting went wrong');
  }
});

/**
 * @api {post} /api/v1/feature/payment/razorpay
 * @apiName PayWithRazorPay
 * Makes payment with RazorPay and marks the order as paid
 */

export const payWithRazorpay = asyncHandler(async (req, res) => {
  const { amount: orderAmount } = req.body;
  const payment_capture = 1;
  const amount = 500;
  const currency = 'INR';

  const options = {
    amount: orderAmount * 100,
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.log(err);
  }
});
