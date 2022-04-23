import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken';
import User from '../models/user.model';
import Hotel from '../models/hotel.model';
import Review from '../models/reviews.model';

/**
 * @api {post} /api/v1/reviews
 * @apiName AddReviewForHotel
 * Request body contains hotelId, userId, rating, and optionally a comment.
 */
export const createHotelReview = asyncHandler(async (req, res) => {
  const { userId, hotelId, rating, comment } = req.body;

  const reviews = await Review.find({
    hotel: hotelId,
  });

  const alreadyReviewed = reviews.find((review) => {
    return (
      review.user.toString() === userId && review.hotel.toString() === hotelId
    );
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this hotel');
  }

  const review = await Review.create({
    hotel: hotelId,
    user: userId,
    rating,
    comment: comment || '',
  });

  res.status(201).json(review);
});
