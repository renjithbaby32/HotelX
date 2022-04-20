import express, { Request, Response, NextFunction } from 'express';
import {
  authAdmin,
  registerAdmin,
  getWeeklyStats,
  getYearlyStats,
  getSettlementStatus,
  getUserList,
  getHotelsList,
  getHotelOwnersList,
  blockOrUnblockUser,
  blockOrUnblockHotel,
  blockOrUnblockHotelOwner,
  generateSalesReport,
} from '../controllers/admin.controller';

const router = express.Router();

router.route('/signin').post(authAdmin);
router.route('/signup').post(registerAdmin);
router.route('/salesreport').post(generateSalesReport);
router.route('/weekly-stats').post(getWeeklyStats);
router.route('/monthly-stats').get(getYearlyStats);
router.route('/settlement-stats').get(getSettlementStatus);
router.route('/userlist').get(getUserList);
router.route('/hotelslist').get(getHotelsList);
router.route('/hotel-owners-list').get(getHotelOwnersList);
router.route('/user/block-unblock/:userId').post(blockOrUnblockUser);
router.route('/hotel/block-unblock/:hotelId').post(blockOrUnblockHotel);
router
  .route('/hotel-owner/block-unblock/:hotelOwnerId')
  .post(blockOrUnblockHotelOwner);

export default router;
