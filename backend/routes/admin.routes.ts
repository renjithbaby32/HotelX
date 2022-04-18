import express, { Request, Response, NextFunction } from 'express';
import {
  authAdmin,
  registerAdmin,
  getWeeklyStats,
  getYearlyStats,
} from '../controllers/admin.controller';

const router = express.Router();

router.route('/signin').post(authAdmin);
router.route('/signup').post(registerAdmin);
router.route('/weekly-stats').post(getWeeklyStats);
router.route('/monthly-stats').get(getYearlyStats);

export default router;
