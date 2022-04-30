"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotel_controller_1 = require("../controllers/hotel.controller");
const router = express_1.default.Router();
router.post('/register', hotel_controller_1.addHotel);
router.post('/edit', hotel_controller_1.editHotel);
router.get('/get-nearby-hotels/', hotel_controller_1.getNearbyHotels);
router.get('/gethotels', hotel_controller_1.getHotels);
router.get('/:hotelid', hotel_controller_1.getHotelDetails);
exports.default = router;
