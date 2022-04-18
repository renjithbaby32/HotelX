import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import compression from 'compression';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import reviewsRouter from './routes/reviews.routes';
import userRouter from './routes/user.routes';
import adminRouter from './routes/admin.routes';
import hotelRouter from './routes/hotel.routes';
import hotelOwnerRouter from './routes/hotelOwner.routes';
import bookingRouter from './routes/booking.routes';
import { cloudinaryConfig } from './config/cloudinary.config';

import { errorHandler, notFound } from './middleware/errorMiddleWare';

import connectDB from './config/db';
connectDB();

config();
const upload = multer();

let PORT = (process.env.PORT as string) || '5000';

const app = express();

const baseAPI = '/api/v1';

app.use(
  cors({
    origin: '*',
    methods: '*',
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(
  compression({
    level: 6,
    threshold: 1024 * 10,
  })
);

app.use(upload.array('images', 5));

app.use(`${baseAPI}/user`, userRouter);
app.use(`${baseAPI}/hotel-owner`, hotelOwnerRouter);
app.use(`${baseAPI}/hotel`, hotelRouter);
app.use(`${baseAPI}/booking`, bookingRouter);

app.use(notFound);
app.use(errorHandler);

const dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  console.log(path.join(dirname, '/frontend/build'));
  app.use(express.static(path.join(dirname, '/frontend/build')));

  app.get('*', (req, res, next) =>
    res.sendFile('index.html', { root: '/frontend/build' }, (err) => {
      if (err) {
        next(err);
      }
    })
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
