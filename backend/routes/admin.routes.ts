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
  getNotifications,
  addNotification,
  clearNotifications,
} from '../controllers/admin.controller';
import { adminProtectedRoute } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/signin').post(authAdmin);
router.route('/signup').post(registerAdmin);
router.route('/salesreport').post(adminProtectedRoute, generateSalesReport);
router.route('/weekly-stats').post(adminProtectedRoute, getWeeklyStats);
router.route('/monthly-stats').get(adminProtectedRoute, getYearlyStats);
router.route('/settlement-stats').get(adminProtectedRoute, getSettlementStatus);
router.route('/userlist').get(adminProtectedRoute, getUserList);
router.route('/hotelslist').get(adminProtectedRoute, getHotelsList);
router.route('/hotel-owners-list').get(adminProtectedRoute, getHotelOwnersList);
router.route('/notifications').get(adminProtectedRoute, getNotifications);
router.route('/add-notification').post(adminProtectedRoute, addNotification);
router
  .route('/clear-notifications')
  .post(adminProtectedRoute, clearNotifications);
router
  .route('/user/block-unblock/:userId')
  .post(adminProtectedRoute, blockOrUnblockUser);
router
  .route('/hotel/block-unblock/:hotelId')
  .post(adminProtectedRoute, blockOrUnblockHotel);
router
  .route('/hotel-owner/block-unblock/:hotelOwnerId')
  .post(adminProtectedRoute, blockOrUnblockHotelOwner);

export default router;
