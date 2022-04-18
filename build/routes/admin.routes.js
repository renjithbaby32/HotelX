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
router.route('/weekly-stats').post(admin_controller_1.getWeeklyStats);
router.route('/monthly-stats').get(admin_controller_1.getYearlyStats);
exports.default = router;
