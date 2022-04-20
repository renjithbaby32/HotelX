import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken';
import Admin from '../models/admin.model';
import User from '../models/user.model';
import Booking from '../models/booking.model';
import Hotel from '../models/hotel.model';
import HotelOwner from '../models/hotelOwner.model';
import { addMonths, subYears, subMonths } from 'date-fns';

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

/**
 * @api {get} /api/v1/admin/settlement-stats
 * @apiName SettlementStatsOfTheMonth
 */
export const getSettlementStatus = asyncHandler(async (req, res) => {
  const monthlyBookings = await Booking.find({
    createdAt: {
      $gte: subMonths(new Date(), 1),
    },
  });

  let amountPaid = 0;
  let amountPending = 0;
  monthlyBookings.forEach((booking) => {
    if (booking.amountPaid === 0) {
      amountPending += booking.amount;
    } else {
      amountPaid += booking.amount;
    }
  });

  res.json({
    amountPaid,
    amountPending,
  });
});

/**
 * @api {get} /api/v1/admin/userlist
 * @apiName UserList
 * Returns the list of all users
 */
export const getUserList = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json(users);
});

/**
 * @api {get} /api/v1/admin/hotelslist
 * @apiName HotelList
 * Returns the list of all hotels
 */
export const getHotelsList = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find().populate('owner');
  res.status(200).json(hotels);
});

/**
 * @api {get} /api/v1/admin/notifications
 * @apiName GetAdminNotifications
 * Returns the list of all notifications
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne();
  const notifications = admin.notifications;
  const result = [];
  for (let i = 0; i < 5; i++) {
    result.push(notifications.pop());
  }

  res.status(200).json(result);
});

/**
 * @api {post} /api/v1/admin/add-notification
 * @apiName AddAdminNotification
 * Adds a new notification to the list of notifications
 */
export const addNotification = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne();
  admin.notifications.push(req.body);
  await admin.save();
  res.status(200).json(admin.notifications);
});

/**
 * @api {post} /api/v1/admin/clear-notifications
 * @apiName ClearAdminNotifications
 * Marks all notifications as read
 */
export const clearNotifications = asyncHandler(async (req, res) => {
  const admin = await Admin.findOne();
  admin.notifications.forEach((notification: any) => {
    notification.isUnread = false;
  });
  await admin.save();
  res.status(200).json(admin.notifications);
});

/**
 * @api {get} /api/v1/admin/hotel-owners-list
 * @apiName HotelOwnersList
 * Returns the list of all hotel owners
 */
export const getHotelOwnersList = asyncHandler(async (req, res) => {
  const hotelOwners = await HotelOwner.find();
  res.status(200).json(hotelOwners);
});

/**
 * @api {post} /api/v1/admin/user/block-unblock/:userId
 * @apiName BlockOrUnblockUser
 * Blocks or unblocks a user
 */
export const blockOrUnblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isBlocked) {
    user.isBlocked = false;
  } else {
    user.isBlocked = true;
  }
  await user.save();
  res.status(200).json(user);
});

/**
 * @api {post} /api/v1/admin/hotel/block-unblock/:hotelId
 * @apiName BlockOrUnblockHotel
 * Blocks or unblocks a hotel
 */
export const blockOrUnblockHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);

  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }

  if (hotel.isActive) {
    hotel.isActive = false;
  } else {
    hotel.isActive = true;
  }
  await hotel.save();
  res.status(200).json(hotel);
});

/**
 * @api {post} /api/v1/admin/hotel-owner/block-unblock/:hotelOwnerId
 * @apiName BlockOrUnblockUser
 * Blocks or unblocks a hotel owner
 */
export const blockOrUnblockHotelOwner = asyncHandler(async (req, res) => {
  const hotelOwner = await HotelOwner.findById(req.params.hotelOwnerId);

  if (!hotelOwner) {
    res.status(404);
    throw new Error('Hotel wwner not found');
  }

  if (hotelOwner.isBlocked) {
    hotelOwner.isBlocked = false;
  } else {
    hotelOwner.isBlocked = true;
  }
  await hotelOwner.save();
  res.status(200).json(hotelOwner);
});

/**
 * @api {post} /api/v1/admin/salesreport
 * @apiName SalesReport
 * generates sales report for the given date range
 */
export const generateSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;
  const boookings = await Booking.find({
    createdAt: {
      $gte: startDate ? startDate : subMonths(new Date(), 1),
      $lt: endDate ? endDate : new Date(),
    },
  }).populate('hotel');

  type salesReport = {
    id: string;
    name: string;
    totalNumberOfRooms: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
  };

  let salesReport: salesReport[] = [];

  boookings.forEach((booking) => {
    const name = booking.hotel.name;
    const numberOfRoomsPaidFor =
      booking.numberOfBudgetRoomsBooked + booking.numberOfPremiumRoomsBooked;
    const totalAmount = booking.amount;
    const paidAmount = booking.amountPaid;
    const pendingAmount = booking.amount - booking.amountPaid;
    const salesReportObj = {
      id: booking._id,
      name,
      totalNumberOfRooms: numberOfRoomsPaidFor,
      numberOfRoomsPaidFor,
      totalAmount,
      paidAmount,
      pendingAmount,
    };

    let found = false;
    salesReport.forEach((report) => {
      if (report.name === name) {
        report.totalNumberOfRooms += numberOfRoomsPaidFor;
        report.totalAmount += totalAmount;
        report.paidAmount += paidAmount;
        report.pendingAmount += pendingAmount;
        found = true;
      }
    });
    if (!found) {
      salesReport.push(salesReportObj);
    }
  });
  res.status(200).json(salesReport);
});
