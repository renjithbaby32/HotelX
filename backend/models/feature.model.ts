import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    numberOfHits: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Feature = mongoose.model('Feature', featureSchema);

export default Feature;
