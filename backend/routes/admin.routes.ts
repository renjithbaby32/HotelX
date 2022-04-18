import express, { Request, Response, NextFunction } from 'express';
import { authAdmin, registerAdmin } from '../controllers/admin.controller';

const router = express.Router();

router.route('/signin').post(authAdmin);
router.route('/signup').post(registerAdmin);

export default router;
