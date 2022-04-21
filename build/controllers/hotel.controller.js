"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotelDetails = exports.getNearbyHotels = exports.getHotels = exports.addHotel = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const hotel_model_1 = __importDefault(require("../models/hotel.model"));
const cloudinary_1 = __importDefault(require("cloudinary"));
/**
 * @api {post} /api/v1/hotel/register
 * @apiName HotelRegister
 * Request body contains name of the hotel, its owner's id, state, city, coordinates, postal code, stars, cost per day budget, number of budget rooms, cost per day premium,
 * total number of premium rooms, total number of rooms, whether it has premium rooms, main image and extra images.
 * If the hotel owner is blocked, he/she will not be able to signin.
 * Else, email and password is verified and a token is generated if the credentials are valid.
 */
exports.addHotel = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, state, city, coordinates, postalCode, stars, costPerDayBudget, costPerDayPremium, totalNumberOfRooms, hasPremiumRooms, numberOfBudgetRooms, numberOfPremiumRooms, mainImage, extraImages, hotelOwnerId, } = req.body;
    let extraImagesArray = [];
    if (extraImages) {
        if (typeof req.body.extraImages === 'string') {
            extraImagesArray.push(req.body.extraImages);
        }
        else {
            extraImagesArray = req.body.extraImages;
        }
    }
    let extraImagesLinks = [];
    for (let i = 0; i < extraImagesArray.length; i++) {
        const result = yield cloudinary_1.default.v2.uploader.upload(extraImagesArray[i], {
            folder: 'hotels',
            crop: 'scale',
        });
        extraImagesLinks.push(result.secure_url);
    }
    const mainImageUploaded = yield cloudinary_1.default.v2.uploader.upload(mainImage, {
        folder: 'hotels',
        crop: 'scale',
    });
    const coordinatesArray = coordinates.split(',');
    const hotelExists = yield hotel_model_1.default.findOne({ name });
    if (hotelExists) {
        res.status(400);
        throw new Error('Hotel already exists');
    }
    const hotel = yield hotel_model_1.default.create({
        name,
        state,
        city,
        coordinates: {
            type: 'Point',
            coordinates: [coordinatesArray[0], coordinatesArray[1]],
        },
        postalCode,
        owner: hotelOwnerId,
        stars,
        costPerDayBudget,
        costPerDayPremium,
        totalNumberOfRooms,
        hasPremiumRooms,
        numberOfBudgetRooms,
        numberOfPremiumRooms,
        mainImage: mainImageUploaded.secure_url,
        extraImages: extraImagesLinks,
    });
    if (hotel) {
        res.status(201).json({
            _id: hotel._id,
            name: hotel.name,
            owner: hotel.owner,
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid hotel data');
    }
}));
/**
 * @api {get} /api/v1/hotel/gethotels
 * @apiName HotelList
 * Sends back an array containing information about all hotels.
 */
exports.getHotels = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotels = yield hotel_model_1.default.find({
        isActive: true,
    });
    if (hotels) {
        res.status(200).json(hotels);
    }
    else {
        res.status(400);
        throw new Error('Someting went wrong');
    }
}));
/**
 * @api {get} /api/v1/hotel/getNearbyHotels
 * @apiName NearbyHotelList
 * Sends back an array containing information about all nearby hotels.
 */
exports.getNearbyHotels = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { latitude, longitude } = req.query;
    const hotels = yield hotel_model_1.default.find({
        isActive: true,
        coordinates: {
            $near: {
                $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                $minDistance: 0,
                $maxDistance: 1000 * 100,
            },
        },
    });
    if (hotels) {
        res.status(200).json(hotels);
    }
    else {
        res.status(400);
        throw new Error('Someting went wrong');
    }
}));
/**
 * @api {get} /api/v1/hotel/:hotelid
 * @apiName GetHotelInformation
 * Sends back an object containing details about one specific hotel
 */
exports.getHotelDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hotel = yield hotel_model_1.default.findById(req.params.hotelid);
    if (hotel) {
        res.status(200).json(hotel);
    }
    else {
        res.status(400);
        throw new Error('Hotel does not exist');
    }
}));
