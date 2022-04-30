import asyncHandler from 'express-async-handler';
import Hotel from '../models/hotel.model';
import cloudinary from 'cloudinary';

/**
 * @api {post} /api/v1/hotel/register
 * @apiName HotelRegister
 * Request body contains name of the hotel, its owner's id, state, city, coordinates, postal code, stars, cost per day budget, number of budget rooms, cost per day premium,
 * total number of premium rooms, total number of rooms, whether it has premium rooms, main image and extra images.
 * If the hotel owner is blocked, he/she will not be able to signin.
 * Else, email and password is verified and a token is generated if the credentials are valid.
 */

export const addHotel = asyncHandler(async (req, res) => {
  const {
    name,
    state,
    city,
    coordinates,
    postalCode,
    stars,
    costPerDayBudget,
    costPerDayPremium,
    totalNumberOfRooms,
    hasPremiumRooms,
    numberOfBudgetRooms,
    numberOfPremiumRooms,
    mainImage,
    extraImages,
    hotelOwnerId,
  } = req.body;

  let extraImagesArray = [];
  if (extraImages) {
    if (typeof req.body.extraImages === 'string') {
      extraImagesArray.push(req.body.extraImages);
    } else {
      extraImagesArray = req.body.extraImages;
    }
  }

  let extraImagesLinks = [];

  for (let i = 0; i < extraImagesArray.length; i++) {
    const result = await cloudinary.v2.uploader.upload(extraImagesArray[i], {
      folder: 'hotels',
      crop: 'scale',
    });

    extraImagesLinks.push(result.secure_url);
  }

  const mainImageUploaded = await cloudinary.v2.uploader.upload(mainImage, {
    folder: 'hotels',
    crop: 'scale',
  });

  const coordinatesArray = coordinates.split(',');

  const hotelExists = await Hotel.findOne({ name });

  if (hotelExists) {
    res.status(400);
    throw new Error('Hotel already exists');
  }

  const hotel = await Hotel.create({
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
    hasPremiumRooms: numberOfPremiumRooms > 0 ? true : false,
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
  } else {
    res.status(400);
    throw new Error('Invalid hotel data');
  }
});

/**
 * @api {post} /api/v1/hotel/edit
 * @apiName HotelEdit
 * Request body contains name of the hotel, its owner's id, state, city, coordinates, postal code, stars, cost per day budget, number of budget rooms, cost per day premium,
 * total number of premium rooms, total number of rooms,and whether it has premium rooms
 * If the hotel owner is blocked, he/she will not be able to signin.
 * Else, email and password is verified and a token is generated if the credentials are valid.
 */

export const editHotel = asyncHandler(async (req, res) => {
  const {
    name,
    state,
    city,
    coordinates,
    postalCode,
    stars,
    costPerDayBudget,
    costPerDayPremium,
    totalNumberOfRooms,
    numberOfBudgetRooms,
    numberOfPremiumRooms,
    hotelOwnerId,
    hotelId,
    discountPercentage,
  } = req.body;

  const coordinatesArray = coordinates.split(',');

  const hotel = await Hotel.findById(hotelId);

  hotel.name = name;
  hotel.state = state;
  hotel.city = city;
  hotel.coordinates = {
    type: 'Point',
    coordinates: [coordinatesArray[0], coordinatesArray[1]],
  };
  hotel.postalCode = postalCode;
  hotel.stars = stars;
  hotel.costPerDayBudget = costPerDayBudget;
  hotel.costPerDayPremium = costPerDayPremium;
  hotel.totalNumberOfRooms = totalNumberOfRooms;
  hotel.hasPremiumRooms = numberOfPremiumRooms > 0 ? true : false;
  hotel.numberOfBudgetRooms = numberOfBudgetRooms;
  hotel.numberOfPremiumRooms = numberOfPremiumRooms;
  hotel.owner = hotelOwnerId;
  hotel.discountPercentage = discountPercentage;

  await hotel.save();

  res.status(201).json({
    _id: hotel._id,
    name: hotel.name,
    owner: hotel.owner,
  });
});

/**
 * @api {get} /api/v1/hotel/gethotels
 * @apiName HotelList
 * Sends back an array containing information about all hotels.
 */

export const getHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find({
    isActive: true,
  }).limit(10);

  if (hotels) {
    res.status(200).json(hotels);
  } else {
    res.status(400);
    throw new Error('Someting went wrong');
  }
});

/**
 * @api {get} /api/v1/hotel/getNearbyHotels
 * @apiName NearbyHotelList
 * Sends back an array containing information about all nearby hotels.
 */

export const getNearbyHotels = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.query;
  const hotels = await Hotel.find({
    isActive: true,
    coordinates: {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $minDistance: 0,
        $maxDistance: 1000 * 100,
      },
    },
  }).limit(10);

  if (hotels) {
    res.status(200).json(hotels);
  } else {
    res.status(400);
    throw new Error('Someting went wrong');
  }
});

/**
 * @api {get} /api/v1/hotel/:hotelid
 * @apiName GetHotelInformation
 * Sends back an object containing details about one specific hotel
 */

export const getHotelDetails = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelid);

  if (hotel) {
    res.status(200).json(hotel);
  } else {
    res.status(400);
    throw new Error('Hotel does not exist');
  }
});
