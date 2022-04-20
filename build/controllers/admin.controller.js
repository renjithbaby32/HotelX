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
exports.generateSalesReport = exports.blockOrUnblockHotelOwner = exports.blockOrUnblockHotel = exports.blockOrUnblockUser = exports.getHotelOwnersList = exports.getHotelsList = exports.getUserList = exports.getSettlementStatus = exports.getYearlyStats = exports.getWeeklyStats = exports.registerAdmin = exports.authAdmin = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const admin_model_1 = __importDefault(require("../models/admin.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const hotelOwner_model_1 = __importDefault(require("../models/hotelOwner.model"));
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
    const newUsers = yield user_model_1.default.find({
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
/**
 * @api {get} /api/v1/admin/settlement-stats
 * @apiName SettlementStatsOfTheMonth
 */
exports.getSettlementStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const monthlyBookings = yield booking_model_1.default.find({
        createdAt: {
            $gte: (0, date_fns_1.subMonths)(new Date(), 1),
        },
    });
    let amountPaid = 0;
    let amountPending = 0;
    monthlyBookings.forEach((booking) => {
        if (booking.amountPaid === 0) {
            amountPending += booking.amount;
        }
        else {
            amountPaid += booking.amount;
        }
    });
    res.json({
        amountPaid,
        amountPending,
    });
}));
/**
 * @api {get} /api/v1/admin/userlist
 * @apiName UserList
 * Returns the list of all users
 */
exports.getUserList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find();
    res.status(200).json(users);
}));
/**
 * @api {get} /api/v1/admin/hotelslist
 * @apiName HotelList
 * Returns the list of all hotels
 */
exports.getHotelsList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotels = yield hotel_model_1.default.find().populate('owner');
    res.status(200).json(hotels);
}));
/**
 * @api {get} /api/v1/admin/hotel-owners-list
 * @apiName HotelOwnersList
 * Returns the list of all hotel owners
 */
exports.getHotelOwnersList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotelOwners = yield hotelOwner_model_1.default.find();
    res.status(200).json(hotelOwners);
}));
/**
 * @api {post} /api/v1/admin/user/block-unblock/:userId
 * @apiName BlockOrUnblockUser
 * Blocks or unblocks a user
 */
exports.blockOrUnblockUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.params.userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (user.isBlocked) {
        user.isBlocked = false;
    }
    else {
        user.isBlocked = true;
    }
    yield user.save();
    res.status(200).json(user);
}));
/**
 * @api {post} /api/v1/admin/hotel/block-unblock/:hotelId
 * @apiName BlockOrUnblockHotel
 * Blocks or unblocks a hotel
 */
exports.blockOrUnblockHotel = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotel = yield hotel_model_1.default.findById(req.params.hotelId);
    if (!hotel) {
        res.status(404);
        throw new Error('Hotel not found');
    }
    if (hotel.isActive) {
        hotel.isActive = false;
    }
    else {
        hotel.isActive = true;
    }
    yield hotel.save();
    res.status(200).json(hotel);
}));
/**
 * @api {post} /api/v1/admin/hotel-owner/block-unblock/:hotelOwnerId
 * @apiName BlockOrUnblockUser
 * Blocks or unblocks a hotel owner
 */
exports.blockOrUnblockHotelOwner = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotelOwner = yield hotelOwner_model_1.default.findById(req.params.hotelOwnerId);
    if (!hotelOwner) {
        res.status(404);
        throw new Error('Hotel wwner not found');
    }
    if (hotelOwner.isBlocked) {
        hotelOwner.isBlocked = false;
    }
    else {
        hotelOwner.isBlocked = true;
    }
    yield hotelOwner.save();
    res.status(200).json(hotelOwner);
}));
/**
 * @api {post} /api/v1/admin/salesreport
 * @apiName SalesReport
 * generates sales report for the given date range
 */
exports.generateSalesReport = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate } = req.body;
    const boookings = yield booking_model_1.default.find({
        createdAt: {
            $gte: startDate ? startDate : (0, date_fns_1.subMonths)(new Date(), 1),
            $lt: endDate ? endDate : new Date(),
        },
    }).populate('hotel');
    let salesReport = [];
    boookings.forEach((booking) => {
        const name = booking.hotel.name;
        const numberOfRoomsPaidFor = booking.numberOfBudgetRoomsBooked + booking.numberOfPremiumRoomsBooked;
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
}));
