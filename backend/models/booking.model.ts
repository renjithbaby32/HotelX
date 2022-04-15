import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    hotel: {
      type: mongoose.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    numberOfBudgetRoomsBooked: {
      type: Number,
      default: 0,
    },
    numberOfPremiumRoomsBooked: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
