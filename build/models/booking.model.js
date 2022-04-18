"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    },
    hotel: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    numberOfBudgetRoomsBooked: {
        type: Number,
        default: 0,
    },
    numberOfPremiumRoomsBooked: {
        type: Number,
        default: 0,
    },
    amountPaid: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Booking = mongoose_1.default.model('Booking', bookingSchema);
exports.default = Booking;
