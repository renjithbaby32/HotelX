"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
router.route('/signin').post(admin_controller_1.authAdmin);
router.route('/signup').post(admin_controller_1.registerAdmin);
router.route('/salesreport').post(admin_controller_1.generateSalesReport);
router.route('/weekly-stats').post(admin_controller_1.getWeeklyStats);
router.route('/monthly-stats').get(admin_controller_1.getYearlyStats);
router.route('/settlement-stats').get(admin_controller_1.getSettlementStatus);
router.route('/userlist').get(admin_controller_1.getUserList);
router.route('/hotelslist').get(admin_controller_1.getHotelsList);
router.route('/hotel-owners-list').get(admin_controller_1.getHotelOwnersList);
router.route('/notifications').get(admin_controller_1.getNotifications);
router.route('/add-notification').post(admin_controller_1.addNotification);
router.route('/clear-notifications').post(admin_controller_1.clearNotifications);
router.route('/user/block-unblock/:userId').post(admin_controller_1.blockOrUnblockUser);
router.route('/hotel/block-unblock/:hotelId').post(admin_controller_1.blockOrUnblockHotel);
router
    .route('/hotel-owner/block-unblock/:hotelOwnerId')
    .post(admin_controller_1.blockOrUnblockHotelOwner);
exports.default = router;
