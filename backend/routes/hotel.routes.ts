import express, { Request, Response, NextFunction } from 'express';
import {
  addHotel,
  getHotels,
  getNearbyHotels,
  getHotelDetails,
} from '../controllers/hotel.controller';

const router = express.Router();

router.post('/register', addHotel);
router.get('/get-nearby-hotels/', getNearbyHotels);
router.get('/gethotels', getHotels);
router.get('/:hotelid', getHotelDetails);

export default router;
