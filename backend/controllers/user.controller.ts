import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken';
import User from '../models/user.model';
import Booking from '../models/booking.model';

/**
 * @api {post} /api/v1/user/signin
 * @apiName UserSignIn
 * Request body contains email and password.
 * If the user is blocked, the user will not be able to signin.
 * Else, email and password is verified and a token is generated if the credentials are valid.
 */

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.isBlocked) {
    res.status(401);
    throw new Error('You are blocked!');
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @api {post} /api/v1/user/signup
 * @apiName UserSignUp
 * Request containing name, email, password and phone number of a new user.
 * Checks if the user already exists in the database, else creates a new user.
 * JWT Token is generated and is sent back along with the other user details excluding the password.
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      phone: user.phone,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @api {get} /api/v1/user/bookings
 * @apiName UserBookings
 * Returns all the bookings of the user.
 */
export const getBookings = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const bookings = await Booking.find({
    user: userId,
  }).populate('hotel', 'name city state mainImage ');

  res.status(200).json(bookings);
});
