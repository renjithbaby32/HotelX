"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotelOwner_controller_1 = require("../controllers/hotelOwner.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/signin').post(hotelOwner_controller_1.authHotelOwner);
router.route('/signup').post(hotelOwner_controller_1.registerHotelOwner);
router.route('/sendOTP/:phone').post(hotelOwner_controller_1.sendOTP);
router.route('/verifyOTP/:phone').post(hotelOwner_controller_1.verifyOTP);
router
    .route('/upcoming-bookings')
    .post(authMiddleware_1.hotelOwnerProtectedRoute, hotelOwner_controller_1.getUpComingBookings);
router
    .route('/gethotels/:hotelownerid')
    .get(authMiddleware_1.hotelOwnerProtectedRoute, hotelOwner_controller_1.getHotels);
exports.default = router;
