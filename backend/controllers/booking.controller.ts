import asyncHandler from 'express-async-handler';
import Hotel from '../models/hotel.model';
import Booking from '../models/booking.model';
import {
  addDays,
  parseISO,
  isSameDay,
  differenceInDays,
  format,
} from 'date-fns';
import { RequestWithIdentity } from '../middleware/authMiddleware';
import { razorpay } from '../config/razorpay.config';
import shortid from 'shortid';

type resultType = {
  customerName: string;
  budgetRooms: number;
  premiumRooms: number;
  phone: number;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  amount: number;
  amountDue: number;
};

/**
 * @api {post} /api/v1/booking/availability/:hotelid
 * @apiName HotelAvailability
 * Finds if there is an availability for the given dates in the hotel.
 */

export const checkAvailability = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelid);

  let maxAvailabilityOfBudgetRooms = Number.MAX_VALUE;
  let maxAvailabilityOfPremiumRooms = Number.MAX_VALUE;
  for (let i = 0; i < req.body.numberOfDays; i++) {
    const day = addDays(parseISO(req.body.startDate), i);

    let found = false;
    let index = 0;
    for (let i = 0; i < hotel.availability.length; i++) {
      if (isSameDay(hotel.availability[i].date, day)) {
        found = true;
        index = i;
        break;
      }
    }

    if (found) {
      maxAvailabilityOfBudgetRooms = Math.min(
        maxAvailabilityOfBudgetRooms,
        hotel.availability[index].numberOfBudgetRoomsAvailable
      );
      maxAvailabilityOfPremiumRooms = Math.min(
        maxAvailabilityOfPremiumRooms,
        hotel.availability[index].numberOfPremiumRoomsAvailable
      );
    } else {
      hotel.availability.push({
        date: day,
        numberOfBudgetRoomsAvailable: hotel.numberOfBudgetRooms,
        numberOfPremiumRoomsAvailable: hotel.numberOfPremiumRooms,
      });
      await hotel.save();
      maxAvailabilityOfBudgetRooms = Math.min(
        maxAvailabilityOfBudgetRooms,
        hotel.availability[hotel.availability.length - 1]
          .numberOfBudgetRoomsAvailable
      );
      maxAvailabilityOfPremiumRooms = Math.min(
        maxAvailabilityOfPremiumRooms,
        hotel.availability[hotel.availability.length - 1]
          .numberOfPremiumRoomsAvailable
      );
    }
  }

  res.json({
    maxAvailabilityOfBudgetRooms,
    maxAvailabilityOfPremiumRooms,
  });
});

/**
 * @api {post} /api/v1/booking/book/:hotelid
 * @apiName BookHotel
 * Reserves the hotel for the given dates.
 */

export const bookRooms = asyncHandler(async (req: RequestWithIdentity, res) => {
  let startDate: Date | string = new Date(req.body.startDate);
  let endDate: Date | string = new Date(req.body.endDate);
  const numberOfDays = differenceInDays(endDate, startDate);
  const hotel = await Hotel.findById(req.params.hotelid);

  startDate = startDate.toISOString();
  endDate = endDate.toISOString();
  const booking = new Booking({
    checkInDate: startDate,
    checkOutDate: endDate,
    hotel,
    user: req.user,
    amount: req.body.amount,
    paymentMethod: req.body.paymentMethod,
    amountPaid: req.body.amountPaid,
    numberOfBudgetRoomsBooked: req.body.numberOfBudgetRoomsBooked,
    numberOfPremiumRoomsBooked: req.body.numberOfPremiumRoomsBooked,
  });

  await booking.save();

  for (let i = 0; i < numberOfDays; i++) {
    const day = addDays(parseISO(startDate), i);

    let found = false;
    let index = 0;
    for (let i = 0; i < hotel.availability.length; i++) {
      if (isSameDay(hotel.availability[i].date, day)) {
        found = true;
        index = i;
        break;
      }
    }

    if (found) {
      hotel.availability[index].numberOfBudgetRoomsAvailable -=
        booking.numberOfBudgetRoomsBooked;
      hotel.availability[index].numberOfPremiumRoomsAvailable -=
        booking.numberOfPremiumRoomsBooked;
      await hotel.save();
    }
  }

  res.json(booking);
});

/**
 * @api {get} /api/v1/booking/:bookingid
 * @apiName BookingDetails
 * Returns details about the specified booking
 */

export const getBookingDetails = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.hotelid).populate(
    'hotel',
    'name state city mainImage coordinates'
  );
  if (booking) {
    res.status(200).json(booking);
  } else {
    res.status(404);
  }
});

/**
 * @api {get} /api/v1/booking/checkin/:hotelid
 * @apiName DailyCheckIns
 * Returns details about the specified check in details on a specific date in a specific hotel
 */

export const getCheckInDetailsOfTheDay = asyncHandler(async (req, res) => {
  const date = new Date(req.query.checkInDate as string);
  const bookings = await Booking.find({
    hotel: req.params.hotelid,
  }).populate('user', 'name email phone');

  const result: resultType[] = [];

  bookings.forEach((booking) => {
    const day = booking.checkInDate;
    if (isSameDay(day, date)) {
      const data = {
        customerName: booking.user.name,
        budgetRooms: booking.numberOfBudgetRoomsBooked,
        premiumRooms: booking.numberOfPremiumRoomsBooked,
        phone: booking.user.phone,
        email: booking.user.email,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        amount: booking.amount,
        amountDue: booking.amount - booking.amountPaid,
      };
      result.push(data);
    }
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404);
  }
});

/**
 * @api {get} /api/v1/booking/checkout/:hotelid
 * @apiName DailyCheckOuts
 * Returns details about the specified check out details on a specific date in a specific hotel
 */

export const getCheckOutDetailsOfTheDay = asyncHandler(async (req, res) => {
  const date = new Date(req.query.checkOutDate as string);
  const bookings = await Booking.find({
    hotel: req.params.hotelid,
  }).populate('user', 'name email phone');

  const result: resultType[] = [];

  bookings.forEach((booking) => {
    const day = booking.checkOutDate;
    if (isSameDay(day, date)) {
      const data = {
        customerName: booking.user.name,
        budgetRooms: booking.numberOfBudgetRoomsBooked,
        premiumRooms: booking.numberOfPremiumRoomsBooked,
        phone: booking.user.phone,
        email: booking.user.email,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        amount: booking.amount,
        amountDue: booking.amount - booking.amountPaid,
      };
      result.push(data);
    }
  });
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404);
  }
});

/**
 * @api {get} /api/v1/booking/payment/razorpay/:bookingid
 * @apiName PayWithRazorPay
 * Makes payment with RazorPay and marks the booking as paid
 */

export const payWithRazorpay = asyncHandler(async (req, res) => {
  const { booking } = req.body;
  const payment_capture = 1;
  const amount = 500;
  const currency = 'INR';

  const options = {
    amount: booking.amount * 100,
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
