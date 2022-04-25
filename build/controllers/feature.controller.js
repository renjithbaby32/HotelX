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
exports.payWithRazorpay = exports.addFeaturedPost = exports.getFeaturedPost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const feature_model_1 = __importDefault(require("../models/feature.model"));
const shortid_1 = __importDefault(require("shortid"));
const razorpay_config_1 = require("../config/razorpay.config");
/**
 * @api {get} /api/v1/feature/
 * @apiName GetFeaturePost
 */
exports.getFeaturedPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const featuredPost = yield feature_model_1.default.find({
        numberOfHits: { $gt: 0 },
    })
        .populate('hotel', 'name mainImage')
        .sort({
        numberOfHits: -1,
    })
        .limit(1);
    if (featuredPost) {
        featuredPost[0].numberOfHits = featuredPost[0].numberOfHits - 1;
        yield featuredPost[0].save();
        res.status(200).json(featuredPost[0]);
    }
    else {
        res.status(400);
        throw new Error('Someting went wrong');
    }
}));
/**
 * @api {post} /api/v1/feature/
 * @apiName AddFeaturePost
 */
exports.addFeaturedPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, hotel, numberOfHits } = req.body;
    const newFeature = yield feature_model_1.default.create({
        description,
        hotel,
        numberOfHits,
    });
    if (newFeature) {
        res.status(201).json(newFeature);
    }
    else {
        res.status(400);
        throw new Error('Someting went wrong');
    }
}));
/**
 * @api {post} /api/v1/feature/payment/razorpay
 * @apiName PayWithRazorPay
 * Makes payment with RazorPay and marks the order as paid
 */
exports.payWithRazorpay = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount: orderAmount } = req.body;
    const payment_capture = 1;
    const amount = 500;
    const currency = 'INR';
    const options = {
        amount: orderAmount * 100,
        currency,
        receipt: shortid_1.default.generate(),
        payment_capture,
    };
    try {
        const response = yield razorpay_config_1.razorpay.orders.create(options);
        res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    }
    catch (err) {
        console.log(err);
    }
}));
