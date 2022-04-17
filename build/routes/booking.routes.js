"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../controllers/booking.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/availability/:hotelid').post(booking_controller_1.checkAvailability);
router.route('/book/:hotelid').post(authMiddleware_1.userProtectedRoute, booking_controller_1.bookRooms);
router.route('/:hotelid').get(authMiddleware_1.userProtectedRoute, booking_controller_1.getBookingDetails);
router
    .route('/checkin/:hotelid')
    .get(authMiddleware_1.hotelOwnerProtectedRoute, booking_controller_1.getCheckInDetailsOfTheDay);
router
    .route('/checkout/:hotelid')
    .get(authMiddleware_1.hotelOwnerProtectedRoute, booking_controller_1.getCheckOutDetailsOfTheDay);
router.route('/payment/razorpay').post(authMiddleware_1.userProtectedRoute, booking_controller_1.payWithRazorpay);
exports.default = router;
