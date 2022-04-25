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
exports.getReviews = exports.createHotelReview = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const reviews_model_1 = __importDefault(require("../models/reviews.model"));
/**
 * @api {post} /api/v1/reviews
 * @apiName AddReviewForHotel
 * Request body contains hotelId, userId, rating, and optionally a comment.
 */
exports.createHotelReview = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, hotelId, rating, comment } = req.body;
    const reviews = yield reviews_model_1.default.find({
        hotel: hotelId,
    });
    const alreadyReviewed = reviews.find((review) => {
        return (review.user.toString() === userId && review.hotel.toString() === hotelId);
    });
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this hotel');
    }
    const review = yield reviews_model_1.default.create({
        hotel: hotelId,
        user: userId,
        rating,
        comment: comment || '',
    });
    res.status(201).json(review);
}));
/**
 * @api {post} /api/v1/reviews/:hotelId
 * @apiName GetReviewsForHotel
 */
exports.getReviews = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { hotelId } = req.params;
    const reviews = yield reviews_model_1.default.find({
        hotel: hotelId,
    });
    res.status(200).json(reviews);
}));
