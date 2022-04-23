import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken';
import HotelOwner from '../models/hotelOwner.model';
import { client } from '../config/twilio.config';
import { config } from 'dotenv';
import { addDays, differenceInDays, isSameDay, parseISO } from 'date-fns';
import Hotel from '../models/hotel.model';
import Booking from '../models/booking.model';
import { RequestWithIdentity } from '../middleware/authMiddleware';

config();

/**
 * @api {post} /api/v1/hotel-owner/signin
 * @apiName HotelOwnerSignIn
 * Request body contains email and password.
 * If the hotel owner is blocked, he/she will not be able to signin.
 * Else, email and password is verified and a token is generated if the credentials are valid.
 */

export const authHotelOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const hotelOwner = await HotelOwner.findOne({ email });

  if (hotelOwner.isBlocked) {
    res.status(401);
    throw new Error('You are blocked!');
  }

  if (hotelOwner && (await hotelOwner.matchPassword(password))) {
    res.json({
      _id: hotelOwner._id,
      name: hotelOwner.name,
      email: hotelOwner.email,
      isAdmin: hotelOwner.isAdmin,
      token: generateToken(hotelOwner._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @api {post} /api/v1/hotel-owner/signup
 * @apiName HotelOwnerSignUp
 * Request containing name, email, password and phone number of a hotel owner.
 * Checks if the owner already exists in the database, else creates a new owner.
 * JWT Token is generated and is sent back along with the other owner details excluding the password.
 */
export const registerHotelOwner = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const ownerExists = await HotelOwner.findOne({ email });

  if (ownerExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hotelOwner = await HotelOwner.create({
    name,
    email,
    password,
    phone,
  });

  if (hotelOwner) {
    res.status(201).json({
      _id: hotelOwner._id,
      name: hotelOwner.name,
      email: hotelOwner.email,
      token: generateToken(hotelOwner._id),
      phone: hotelOwner.phone,
    });
  } else {
    res.status(400);
    throw new Error('Invalid hotelOwner data');
  }
});

/**
 * @api {post} /api/v1/hotel-owner/sendOTP
 * @apiName HotelOwnerGetOTP
 * Sends an OTP to the given mobile number
 */
export const sendOTP = asyncHandler(async (req, res) => {
  const phone = req.params.phone;

  const resp = await client.verify
    .services(process.env.SERVICE_SID as string)
    .verifications.create({ to: `+91${phone}`, channel: 'sms' });
  res.json({ message: 'OTP sent' });
});

/**
 * @api {post} /api/v1/hotel-owner/verifyOTP
 * @apiName HotelOwnerVerifyOTP
 * Verifies the OTP
 */
export const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const phone = req.params.phone;

    const { status } = await client.verify
      .services(process.env.SERVICE_SID as string)
      .verificationChecks.create({ to: `+91${phone}`, code: req.body.code });

    console.log(status);

    if (status !== 'approved') {
      res.status(401);
      throw new Error('Invalid OTP');
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(401);
    throw new Error('OTP verification failed');
  }
});

/**
 * @api {post} /api/v1/hotel-owner/upcoming-bookings
 * @apiName GetUpcomingBookings
 * Shows the list of all upcoming bookings of a particular hotel to the hotel owner
 */
export const getUpComingBookings = asyncHandler(async (req, res) => {
  try {
    let { startDate, endDate, hotelId } = req.body;
    startDate = parseISO(startDate);
    endDate = parseISO(endDate);
    const numberOfDays = differenceInDays(endDate, startDate);
    const hotel = await Hotel.findById(hotelId);
    const result = [];
    for (let i = 0; i < numberOfDays; i++) {
      const day = addDays(startDate, i);

      let found = false;
      for (let i = 0; i < hotel.availability.length; i++) {
        if (isSameDay(hotel.availability[i].date, day)) {
          found = true;
          const info = {
            date: day,
            budgetRooms:
              hotel.numberOfBudgetRooms -
              hotel.availability[i].numberOfBudgetRoomsAvailable,
            premiumRooms:
              hotel.numberOfPremiumRooms -
              hotel.availability[i].numberOfPremiumRoomsAvailable,
          };
          result.push(info);
          break;
        }
      }
      if (!found) {
        const defaultInfo = {
          date: day,
          budgetRooms: 0,
          premiumRooms: 0,
        };
        result.push(defaultInfo);
      }
    }

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(401);
    throw new Error('Something went wrong');
  }
});

/**
 * @api {get} /api/v1/hotel-owner/gethotels/:hotelownerid
 * @apiName GetHotelsByOwner
 */
export const getHotels = asyncHandler(async (req, res) => {
  const hotelownerid = req.params.hotelownerid;
  const hotels = await Hotel.find({ owner: hotelownerid });
  res.status(200).json(hotels);
});

/**
 * @api {post} /api/v1/hotel-owner/weekly-stats
 * @apiName WeeklyStats
 */
export const getWeeklyStats = asyncHandler(
  async (req: RequestWithIdentity, res) => {
    const { startDate, hotelOwnerId } = req.body;

    type weeklyStats = {
      weeklySales: number;
      newBookings: number;
    };

    let weeklyStats: weeklyStats = {
      weeklySales: 0,
      newBookings: 0,
    };

    const weeklyBookings = await Booking.find({
      createdAt: {
        $gte: startDate,
      },
    }).populate('hotel', 'owner');

    weeklyBookings.forEach((booking) => {
      if (booking.hotel.owner.toString() === hotelOwnerId) {
        weeklyStats.weeklySales += booking.amount;
        weeklyStats.newBookings += 1;
      }
    });

    res.json(weeklyStats);
  }
);
