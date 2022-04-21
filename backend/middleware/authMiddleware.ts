import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model';
import HotelOwner from '../models/hotelOwner.model';
import Admin from '../models/admin.model';
import { Request, Response, NextFunction } from 'express';

export interface RequestWithIdentity extends Request {
  user?: {
    name: string;
    email: string;
    phone: number;
    isBlocked: boolean;
  };
  hotelOwner?: {
    name: string;
    email: string;
  };
  admin?: {
    name: string;
    email: string;
  };
}

export const userProtectedRoute = asyncHandler(
  async (req: RequestWithIdentity, res: Response, next: NextFunction) => {
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

export const hotelOwnerProtectedRoute = asyncHandler(
  async (req: RequestWithIdentity, res: Response, next: NextFunction) => {
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

        req.hotelOwner = await HotelOwner.findById(decoded.id).select(
          '-password'
        );

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

export const adminProtectedRoute = asyncHandler(
  async (req: RequestWithIdentity, res: Response, next: NextFunction) => {
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

        req.hotelOwner = await Admin.findById(decoded.id).select('-password');

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
