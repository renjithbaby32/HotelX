"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payWithRazorpay = exports.getCheckOutDetailsOfTheDay = exports.getCheckInDetailsOfTheDay = exports.getBookingDetails = exports.bookRooms = exports.checkAvailabilityMain = exports.checkAvailability = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const date_fns_1 = require("date-fns");
const razorpay_config_1 = require("../config/razorpay.config");
const shortid_1 = __importDefault(require("shortid"));
/**
 * @api {post} /api/v1/booking/availability/:hotelid
 * @apiName HotelAvailability
 * Finds if there is an availability for the given dates in the hotel.
 */
exports.checkAvailability = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotel = yield hotel_model_1.default.findById(req.params.hotelid);
    let maxAvailabilityOfBudgetRooms = Number.MAX_VALUE;
    let maxAvailabilityOfPremiumRooms = Number.MAX_VALUE;
    for (let i = 0; i < req.body.numberOfDays; i++) {
        const day = (0, date_fns_1.addDays)((0, date_fns_1.parseISO)(req.body.startDate), i);
        let found = false;
        let index = 0;
        for (let i = 0; i < hotel.availability.length; i++) {
            if ((0, date_fns_1.isSameDay)(hotel.availability[i].date, day)) {
                found = true;
                index = i;
                break;
            }
        }
        if (found) {
            maxAvailabilityOfBudgetRooms = Math.min(maxAvailabilityOfBudgetRooms, hotel.availability[index].numberOfBudgetRoomsAvailable);
            maxAvailabilityOfPremiumRooms = Math.min(maxAvailabilityOfPremiumRooms, hotel.availability[index].numberOfPremiumRoomsAvailable);
        }
        else {
            hotel.availability.push({
                date: day,
                numberOfBudgetRoomsAvailable: hotel.numberOfBudgetRooms,
                numberOfPremiumRoomsAvailable: hotel.numberOfPremiumRooms,
            });
            yield hotel.save();
            maxAvailabilityOfBudgetRooms = Math.min(maxAvailabilityOfBudgetRooms, hotel.availability[hotel.availability.length - 1]
                .numberOfBudgetRoomsAvailable);
            maxAvailabilityOfPremiumRooms = Math.min(maxAvailabilityOfPremiumRooms, hotel.availability[hotel.availability.length - 1]
                .numberOfPremiumRoomsAvailable);
        }
    }
    res.json({
        maxAvailabilityOfBudgetRooms,
        maxAvailabilityOfPremiumRooms,
    });
}));
/**
 * @api {post} /api/v1/booking/availability
 * @apiName MainHotelAvailability
 * Finds if there is an availability for the given dates in every hotels
 */
exports.checkAvailabilityMain = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, numberOfDays, numberOfRooms } = req.body;
    const hotels = yield hotel_model_1.default.find({
        isActive: true,
    });
    const result = [];
    hotels.forEach((hotel) => __awaiter(void 0, void 0, void 0, function* () {
        let maxAvailabilityOfBudgetRooms = Number.MAX_VALUE;
        let maxAvailabilityOfPremiumRooms = Number.MAX_VALUE;
        for (let i = 0; i < numberOfDays; i++) {
            const day = (0, date_fns_1.addDays)((0, date_fns_1.parseISO)(startDate), i);
            let found = false;
            let index = 0;
            for (let i = 0; i < hotel.availability.length; i++) {
                if ((0, date_fns_1.isSameDay)(hotel.availability[i].date, day)) {
                    found = true;
                    index = i;
                    break;
                }
            }
            if (found) {
                maxAvailabilityOfBudgetRooms = Math.min(maxAvailabilityOfBudgetRooms, hotel.availability[index].numberOfBudgetRoomsAvailable);
                maxAvailabilityOfPremiumRooms = Math.min(maxAvailabilityOfPremiumRooms, hotel.availability[index].numberOfPremiumRoomsAvailable);
            }
            else {
                hotel.availability.push({
                    date: day,
                    numberOfBudgetRoomsAvailable: hotel.numberOfBudgetRooms,
                    numberOfPremiumRoomsAvailable: hotel.numberOfPremiumRooms,
                });
                yield hotel.save();
                maxAvailabilityOfBudgetRooms = Math.min(maxAvailabilityOfBudgetRooms, hotel.availability[hotel.availability.length - 1]
                    .numberOfBudgetRoomsAvailable);
                maxAvailabilityOfPremiumRooms = Math.min(maxAvailabilityOfPremiumRooms, hotel.availability[hotel.availability.length - 1]
                    .numberOfPremiumRoomsAvailable);
            }
        }
        if (maxAvailabilityOfBudgetRooms >= numberOfRooms ||
            maxAvailabilityOfPremiumRooms >= numberOfRooms) {
            result.push(hotel);
        }
    }));
    res.status(200).json(result);
}));
/**
 * @api {post} /api/v1/booking/book/:hotelid
 * @apiName BookHotel
 * Reserves the hotel for the given dates.
 */
exports.bookRooms = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let startDate = new Date(req.body.startDate);
    let endDate = new Date(req.body.endDate);
    const numberOfDays = (0, date_fns_1.differenceInDays)(endDate, startDate);
    const hotel = yield hotel_model_1.default.findById(req.params.hotelid);
    startDate = startDate.toISOString();
    endDate = endDate.toISOString();
    const booking = new booking_model_1.default({
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
    yield booking.save();
    for (let i = 0; i < numberOfDays; i++) {
        const day = (0, date_fns_1.addDays)((0, date_fns_1.parseISO)(startDate), i);
        let found = false;
        let index = 0;
        for (let i = 0; i < hotel.availability.length; i++) {
            if ((0, date_fns_1.isSameDay)(hotel.availability[i].date, day)) {
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
            yield hotel.save();
        }
    }
    res.json(booking);
}));
/**
 * @api {get} /api/v1/booking/:bookingid
 * @apiName BookingDetails
 * Returns details about the specified booking
 */
exports.getBookingDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.default.findById(req.params.hotelid).populate('hotel', 'name state city mainImage coordinates');
    if (booking) {
        res.status(200).json(booking);
    }
    else {
        res.status(404);
    }
}));
/**
 * @api {get} /api/v1/booking/checkin/:hotelid
 * @apiName DailyCheckIns
 * Returns details about the specified check in details on a specific date in a specific hotel
 */
exports.getCheckInDetailsOfTheDay = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date(req.query.checkInDate);
    const bookings = yield booking_model_1.default.find({
        hotel: req.params.hotelid,
    }).populate('user', 'name email phone');
    const result = [];
    bookings.forEach((booking) => {
        const day = booking.checkInDate;
        if ((0, date_fns_1.isSameDay)(day, date)) {
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
    }
    else {
        res.status(404);
    }
}));
/**
 * @api {get} /api/v1/booking/checkout/:hotelid
 * @apiName DailyCheckOuts
 * Returns details about the specified check out details on a specific date in a specific hotel
 */
exports.getCheckOutDetailsOfTheDay = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date(req.query.checkOutDate);
    const bookings = yield booking_model_1.default.find({
        hotel: req.params.hotelid,
    }).populate('user', 'name email phone');
    const result = [];
    bookings.forEach((booking) => {
        const day = booking.checkOutDate;
        if ((0, date_fns_1.isSameDay)(day, date)) {
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
    }
    else {
        res.status(404);
    }
}));
/**
 * @api {get} /api/v1/booking/payment/razorpay/
 * @apiName PayWithRazorPay
 * Makes payment with RazorPay and marks the booking as paid
 */
exports.payWithRazorpay = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { booking } = req.body;
    const payment_capture = 1;
    const amount = 500;
    const currency = 'INR';
    const options = {
        amount: booking.amount * 100,
        currency,
        receipt: shortid_1.default.generate(),
        payment_capture,
    };
    try {
        const response = yield razorpay_config_1.razorpay.orders.create(options);
        res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    }
    catch (err) {
        console.log(err);
    }
}));
