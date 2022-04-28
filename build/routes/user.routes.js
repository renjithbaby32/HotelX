"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.route('/signup').post(user_controller_1.registerUser);
router.route('/signin').post(user_controller_1.authUser);
router.route('/signin/google').post(user_controller_1.authUserWithGoogle);
router.route('/signup/google').post(user_controller_1.registerUserWithGoogle);
router.route('/bookings/:userId').get(user_controller_1.getBookings);
exports.default = router;
