import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken';
import Admin from '../models/admin.model';
import User from '../models/admin.model';
import Booking from '../models/booking.model';
import Hotel from '../models/hotel.model';
import { addMonths, subYears } from 'date-fns';

/**
 * @api {post} /api/v1/admin/signin
 * @apiName AdminSignIn
 * Request body contains email and password.
 */

export const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

/**
 * @api {post} /api/v1/admin/signup
 * @apiName AdminSignUp
 * Request containing name, email, password and phone number of a new admin.
 */
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await Admin.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    phone,
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
      phone: admin.phone,
    });
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
});

/**
 * @api {post} /api/v1/admin/weekly-stats
 * @apiName WeeklyStats
 */
export const getWeeklyStats = asyncHandler(async (req, res) => {
  const { startDate } = req.body;

  type weeklyStats = {
    weeklySales: number;
    newBookings: number;
    newUsers: number;
    newHotels: number;
  };

  let weeklyStats: weeklyStats = {
    weeklySales: 0,
    newBookings: 0,
    newUsers: 0,
    newHotels: 0,
  };

  const weeklyBookings = await Booking.find({
    createdAt: {
      $gte: startDate,
    },
  });

  weeklyBookings.forEach((booking) => {
    weeklyStats.weeklySales += booking.amount;
    weeklyStats.newBookings += 1;
  });

  const newHotels = await Hotel.find({
    createdAt: {
      $gte: startDate,
    },
  });

  weeklyStats.newHotels = newHotels.length;

  const newUsers = await User.find({
    createdAt: {
      $gte: startDate,
    },
  });

  weeklyStats.newUsers = newUsers.length;

  res.json(weeklyStats);
});

/**
 * @api {get} /api/v1/admin/monthly-stats
 * @apiName WeeklyStats
 */
export const getYearlyStats = asyncHandler(async (req, res) => {
  const startingMonth = subYears(new Date(), 1);

  type monthlyStats = {
    totalRoomsBooked: number[];
    budgetRoomsBooked: number[];
    premiumRoomsBooked: number[];
  };

  let monthlyStats: monthlyStats = {
    totalRoomsBooked: [],
    budgetRoomsBooked: [],
    premiumRoomsBooked: [],
  };

  for (let i = 0; i < 12; i++) {
    const startDate = addMonths(startingMonth, i);
    const endDate = addMonths(startingMonth, i + 1);
    const bookings = await Booking.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });
    let totalRoomsBooked = 0;
    let budgetRoomsBooked = 0;
    let premiumRoomsBooked = 0;
    bookings.forEach((booking) => {
      budgetRoomsBooked += booking.numberOfBudgetRoomsBooked;
      premiumRoomsBooked += booking.numberOfPremiumRoomsBooked;
    });
    totalRoomsBooked = budgetRoomsBooked + premiumRoomsBooked;
    monthlyStats.totalRoomsBooked.push(totalRoomsBooked);
    monthlyStats.budgetRoomsBooked.push(budgetRoomsBooked);
    monthlyStats.premiumRoomsBooked.push(premiumRoomsBooked);
  }

  res.json(monthlyStats);
});
