"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    hotel: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Hotel',
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    comment: {
        type: String,
    },
}, {
    timestamps: true,
});
const Review = mongoose_1.default.model('Review', reviewSchema);
exports.default = Review;
