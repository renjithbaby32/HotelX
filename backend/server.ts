import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import compression from 'compression';

import reviewsRouter from './routes/reviews.routes';
import userRouter from './routes/user.routes';
import adminRouter from './routes/admin.routes';
import hotelRouter from './routes/hotel.routes';
import hotelOwnerRouter from './routes/hotelOwner.routes';
import bookingRouter from './routes/booking.routes';

import { errorHandler, notFound } from './middleware/errorMiddleWare';

import connectDB from './config/db';
connectDB();

config();

const PORT = process.env.PORT || 5000;

const app = express();

const baseAPI = '/api/v1';

app.use(express.json());
app.use(
  compression({
    level: 6,
    threshold: 1024 * 10,
  })
);
app.use(`${baseAPI}/user`, userRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(5000);
