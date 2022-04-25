"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feature_controller_1 = require("../controllers/feature.controller");
const router = express_1.default.Router();
router.route('/').get(feature_controller_1.getFeaturedPost).post(feature_controller_1.addFeaturedPost);
router.route('/payment/razorpay').post(feature_controller_1.payWithRazorpay);
exports.default = router;
