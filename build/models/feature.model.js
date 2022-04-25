"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const featureSchema = new mongoose_1.default.Schema({
    hotel: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
const Feature = mongoose_1.default.model('Feature', featureSchema);
exports.default = Feature;
