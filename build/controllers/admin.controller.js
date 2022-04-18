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
exports.getYearlyStats = exports.getWeeklyStats = exports.registerAdmin = exports.authAdmin = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const admin_model_2 = __importDefault(require("../models/admin.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const date_fns_1 = require("date-fns");
/**
 * @api {post} /api/v1/admin/signin
 * @apiName AdminSignIn
 * Request body contains email and password.
 */
exports.authAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield admin_model_1.default.findOne({ email });
    if (admin && (yield admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            token: (0, generateToken_1.default)(admin._id),
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));
/**
 * @api {post} /api/v1/admin/signup
 * @apiName AdminSignUp
 * Request containing name, email, password and phone number of a new admin.
 */
exports.registerAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phone } = req.body;
    const userExists = yield admin_model_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const admin = yield admin_model_1.default.create({
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
            token: (0, generateToken_1.default)(admin._id),
            phone: admin.phone,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
}));
/**
 * @api {post} /api/v1/admin/weekly-stats
 * @apiName WeeklyStats
 */
exports.getWeeklyStats = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate } = req.body;
    let weeklyStats = {
        weeklySales: 0,
        newBookings: 0,
        newUsers: 0,
        newHotels: 0,
    };
    const weeklyBookings = yield booking_model_1.default.find({
        createdAt: {
            $gte: startDate,
        },
    });
    weeklyBookings.forEach((booking) => {
        weeklyStats.weeklySales += booking.amount;
        weeklyStats.newBookings += 1;
    });
    const newHotels = yield hotel_model_1.default.find({
        createdAt: {
            $gte: startDate,
        },
    });
    weeklyStats.newHotels = newHotels.length;
    const newUsers = yield admin_model_2.default.find({
        createdAt: {
            $gte: startDate,
        },
    });
    weeklyStats.newUsers = newUsers.length;
    res.json(weeklyStats);
}));
/**
 * @api {get} /api/v1/admin/monthly-stats
 * @apiName WeeklyStats
 */
exports.getYearlyStats = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startingMonth = (0, date_fns_1.subYears)(new Date(), 1);
    let monthlyStats = {
        totalRoomsBooked: [],
        budgetRoomsBooked: [],
        premiumRoomsBooked: [],
    };
    for (let i = 0; i < 12; i++) {
        const startDate = (0, date_fns_1.addMonths)(startingMonth, i);
        const endDate = (0, date_fns_1.addMonths)(startingMonth, i + 1);
        const bookings = yield booking_model_1.default.find({
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
}));
