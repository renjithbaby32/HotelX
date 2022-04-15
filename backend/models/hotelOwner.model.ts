import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const hotelOwnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      minLength: 10,
      maxLength: 10,
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
    },
  },
  {
    timestamps: true,
  }
);

hotelOwnerSchema.methods.matchPassword = async function (
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

hotelOwnerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const HotelOwner = mongoose.model('HotelOwner', hotelOwnerSchema);

export default HotelOwner;
