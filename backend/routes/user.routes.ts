import express, { Request, Response, NextFunction } from 'express';
import { registerUser, authUser } from '../controllers/user.controller';

const router = express.Router();

router.route('/signin').post(authUser);
router.route('/signup').post(registerUser);

export default router;
