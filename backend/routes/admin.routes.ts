import express, { Request, Response, NextFunction } from 'express';
import {
  authAdmin,
  registerAdmin,
  getWeeklyStats,
  getYearlyStats,
  getSettlementStatus,
  getUserList,
  getHotelsList,
} from '../controllers/admin.controller';

const router = express.Router();

router.route('/signin').post(authAdmin);
router.route('/signup').post(registerAdmin);
router.route('/weekly-stats').post(getWeeklyStats);
router.route('/monthly-stats').get(getYearlyStats);
router.route('/settlement-stats').get(getSettlementStatus);
router.route('/userlist').get(getUserList);
router.route('/hotelslist').get(getHotelsList);

export default router;
