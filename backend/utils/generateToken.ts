import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

const generateToken = (id: ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export default generateToken;
