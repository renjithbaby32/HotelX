'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const reviews_controller_1 = require('../controllers/reviews.controller');
const router = express_1.default.Router();
router.route('/').post(reviews_controller_1.createHotelReview);
router.route('/:hotelId').get(reviews_controller_1.getReviews);
exports.default = router;
