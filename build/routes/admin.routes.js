"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/signin').post(admin_controller_1.authAdmin);
router.route('/signup').post(admin_controller_1.registerAdmin);
router.route('/salesreport').post(authMiddleware_1.adminProtectedRoute, admin_controller_1.generateSalesReport);
router.route('/weekly-stats').post(authMiddleware_1.adminProtectedRoute, admin_controller_1.getWeeklyStats);
router.route('/monthly-stats').get(authMiddleware_1.adminProtectedRoute, admin_controller_1.getYearlyStats);
router.route('/settlement-stats').get(authMiddleware_1.adminProtectedRoute, admin_controller_1.getSettlementStatus);
router.route('/userlist').get(authMiddleware_1.adminProtectedRoute, admin_controller_1.getUserList);
router.route('/hotelslist').get(authMiddleware_1.adminProtectedRoute, admin_controller_1.getHotelsList);
router.route('/hotel-owners-list').get(authMiddleware_1.adminProtectedRoute, admin_controller_1.getHotelOwnersList);
router.route('/notifications').get(authMiddleware_1.adminProtectedRoute, admin_controller_1.getNotifications);
router.route('/add-notification').post(authMiddleware_1.adminProtectedRoute, admin_controller_1.addNotification);
router
    .route('/clear-notifications')
    .post(authMiddleware_1.adminProtectedRoute, admin_controller_1.clearNotifications);
router
    .route('/user/block-unblock/:userId')
    .post(authMiddleware_1.adminProtectedRoute, admin_controller_1.blockOrUnblockUser);
router
    .route('/hotel/block-unblock/:hotelId')
    .post(authMiddleware_1.adminProtectedRoute, admin_controller_1.blockOrUnblockHotel);
router
    .route('/hotel-owner/block-unblock/:hotelOwnerId')
    .post(authMiddleware_1.adminProtectedRoute, admin_controller_1.blockOrUnblockHotelOwner);
exports.default = router;
