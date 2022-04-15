import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

export interface RequestWithUser extends Request {
  user?: {
    name: string;
    email: string;
    phone: number;
    isBlocked: boolean;
  };
}

const userProtectedRoute = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];

        const decoded: any = jwt.verify(
          token,
          process.env.JWT_SECRET as string
        );

        req.user = await User.findById(decoded.id).select('-password');

        next();
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);

export { userProtectedRoute };
