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
exports.getBookings = exports.registerUser = exports.authUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
/**
 * @api {post} /api/v1/user/signin
 * @apiName UserSignIn
 * Request body contains email and password.
 * If the user is blocked, the user will not be able to signin.
 * Else, email and password is verified and a token is generated if the credentials are valid.
 */
exports.authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.default.findOne({ email });
    if (user && user.isBlocked) {
        res.status(401);
        throw new Error('You are blocked!');
    }
    if (user && (yield user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));
/**
 * @api {post} /api/v1/user/signup
 * @apiName UserSignUp
 * Request containing name, email, password and phone number of a new user.
 * Checks if the user already exists in the database, else creates a new user.
 * JWT Token is generated and is sent back along with the other user details excluding the password.
 */
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phone } = req.body;
    const userExists = yield user_model_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = yield user_model_1.default.create({
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
            token: (0, generateToken_1.default)(user._id),
            phone: user.phone,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));
/**
 * @api {get} /api/v1/user/bookings
 * @apiName UserBookings
 * Returns all the bookings of the user.
 */
exports.getBookings = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const bookings = yield booking_model_1.default.find({
        user: userId,
    }).populate('hotel', 'name city state mainImage ');
    res.status(200).json(bookings);
}));
