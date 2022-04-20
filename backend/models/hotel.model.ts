import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'HotelOwner',
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    coordinates: {
      type: pointSchema,
      index: '2dsphere',
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
      minLength: 6,
      maxLength: 6,
    },
    stars: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 3,
    },
    costPerDayBudget: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 1000000,
    },
    costPerDayPremium: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 1000000,
    },
    discountPercentage: {
      type: Number,
      required: true,
      default: 0,
    },
    totalNumberOfRooms: {
      type: Number,
      required: true,
      default: 0,
    },
    hasPremiumRooms: {
      type: Boolean,
      required: true,
      default: false,
    },
    numberOfBudgetRooms: {
      type: Number,
      required: true,
      default: 0,
    },
    numberOfPremiumRooms: {
      type: Number,
      required: true,
      default: 0,
    },
    mainImage: {
      type: String,
      required: true,
    },
    extraImages: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    availability: [
      {
        date: {
          type: Date,
        },
        numberOfBudgetRoomsAvailable: {
          type: Number,
        },
        numberOfPremiumRoomsAvailable: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

hotelSchema.index({ coordinates: '2dsphere' });
const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
