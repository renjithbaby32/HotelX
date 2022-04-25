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
exports.getWeeklyStats = exports.getHotels = exports.getUpComingBookings = exports.verifyOTP = exports.sendOTP = exports.registerHotelOwner = exports.authHotelOwner = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const hotelOwner_model_1 = __importDefault(require("../models/hotelOwner.model"));
const twilio_config_1 = require("../config/twilio.config");
const dotenv_1 = require("dotenv");
const date_fns_1 = require("date-fns");
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
(0, dotenv_1.config)();
/**
 * @api {post} /api/v1/hotel-owner/signin
 * @apiName HotelOwnerSignIn
 * Request body contains email and password.
 * If the hotel owner is blocked, he/she will not be able to signin.
 * Else, email and password is verified and a token is generated if the credentials are valid.
 */
exports.authHotelOwner = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const hotelOwner = yield hotelOwner_model_1.default.findOne({ email });
    if (hotelOwner.isBlocked) {
        res.status(401);
        throw new Error('You are blocked!');
    }
    if (hotelOwner && (yield hotelOwner.matchPassword(password))) {
        res.json({
            _id: hotelOwner._id,
            name: hotelOwner.name,
            email: hotelOwner.email,
            isAdmin: hotelOwner.isAdmin,
            token: (0, generateToken_1.default)(hotelOwner._id),
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));
/**
 * @api {post} /api/v1/hotel-owner/signup
 * @apiName HotelOwnerSignUp
 * Request containing name, email, password and phone number of a hotel owner.
 * Checks if the owner already exists in the database, else creates a new owner.
 * JWT Token is generated and is sent back along with the other owner details excluding the password.
 */
exports.registerHotelOwner = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phone } = req.body;
    const ownerExists = yield hotelOwner_model_1.default.findOne({ email });
    if (ownerExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const hotelOwner = yield hotelOwner_model_1.default.create({
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
            token: (0, generateToken_1.default)(hotelOwner._id),
            phone: hotelOwner.phone,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid hotelOwner data');
    }
}));
/**
 * @api {post} /api/v1/hotel-owner/sendOTP
 * @apiName HotelOwnerGetOTP
 * Sends an OTP to the given mobile number
 */
exports.sendOTP = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.params.phone;
    const resp = yield twilio_config_1.client.verify
        .services(process.env.SERVICE_SID)
        .verifications.create({ to: `+91${phone}`, channel: 'sms' });
    res.json({ message: 'OTP sent' });
}));
/**
 * @api {post} /api/v1/hotel-owner/verifyOTP
 * @apiName HotelOwnerVerifyOTP
 * Verifies the OTP
 */
exports.verifyOTP = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const phone = req.params.phone;
        const { status } = yield twilio_config_1.client.verify
            .services(process.env.SERVICE_SID)
            .verificationChecks.create({ to: `+91${phone}`, code: req.body.code });
        console.log(status);
        if (status !== 'approved') {
            res.status(401);
            throw new Error('Invalid OTP');
        }
        res.json({ message: 'OTP verified successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(401);
        throw new Error('OTP verification failed');
    }
}));
/**
 * @api {post} /api/v1/hotel-owner/upcoming-bookings
 * @apiName GetUpcomingBookings
 * Shows the list of all upcoming bookings of a particular hotel to the hotel owner
 */
exports.getUpComingBookings = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { startDate, endDate, hotelId } = req.body;
        startDate = (0, date_fns_1.parseISO)(startDate);
        endDate = (0, date_fns_1.parseISO)(endDate);
        const numberOfDays = (0, date_fns_1.differenceInDays)(endDate, startDate);
        const hotel = yield hotel_model_1.default.findById(hotelId);
        const result = [];
        for (let i = 0; i < numberOfDays; i++) {
            const day = (0, date_fns_1.addDays)(startDate, i);
            let found = false;
            for (let i = 0; i < hotel.availability.length; i++) {
                if ((0, date_fns_1.isSameDay)(hotel.availability[i].date, day)) {
                    found = true;
                    const info = {
                        date: day,
                        budgetRooms: hotel.numberOfBudgetRooms -
                            hotel.availability[i].numberOfBudgetRoomsAvailable,
                        premiumRooms: hotel.numberOfPremiumRooms -
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
    }
    catch (err) {
        console.error(err);
        res.status(401);
        throw new Error('Something went wrong');
    }
}));
/**
 * @api {get} /api/v1/hotel-owner/gethotels/:hotelownerid
 * @apiName GetHotelsByOwner
 */
exports.getHotels = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotelownerid = req.params.hotelownerid;
    const hotels = yield hotel_model_1.default.find({ owner: hotelownerid });
    res.status(200).json(hotels);
}));
/**
 * @api {post} /api/v1/hotel-owner/weekly-stats
 * @apiName WeeklyStats
 */
exports.getWeeklyStats = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, hotelOwnerId } = req.body;
    let weeklyStats = {
        weeklySales: 0,
        newBookings: 0,
    };
    const weeklyBookings = yield booking_model_1.default.find({
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
}));
