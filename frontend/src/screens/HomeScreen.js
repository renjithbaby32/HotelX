import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLocationToLocalStorage } from '../features/userLocation/userLocationSlice';
import { getHotels, getNearbyHotels } from '../features/hotel/hotelSlice';
import { HotelCard } from '../components/HotelCard';
import { useNavigate } from 'react-router-dom';
import { CheckAvailability } from '../components/CheckAvailability';
import { Box, Grid } from '@mui/material';
import { MainFeaturedPost } from '../components/MainFeaturedPost';
import { HotelCardHomeScreen } from '../components/HotelCardHomeScreen';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, nearbyHotels } = useSelector((state) => state.hotel);
  const { admin } = useSelector((state) => state.admin);
  const { hotelOwner } = useSelector((state) => state.hotelOwner);
  const { totalAvailability } = useSelector((state) => state.booking);

  useEffect(() => {
    if (hotelOwner) {
      navigate('/hotel-owner');
    } else if (admin) {
      navigate('/admin');
    }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      if (position) {
        dispatch(
          addLocationToLocalStorage({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
        dispatch(
          getNearbyHotels({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        );
      }
    });
  }, []);

  useEffect(() => {
    dispatch(getHotels());
  }, []);

  return (
    <div>
      <CheckAvailability />
      <MainFeaturedPost />

      {totalAvailability ? (
        <Box my={3} p={3}>
          <h1>Hotels available on given dates</h1>
          <HotelCardHomeScreen hotels={totalAvailability} />
        </Box>
      ) : (
        <Box my={3} p={3}>
          {nearbyHotels.length > 0 && <h1>Nearby hotels (within 100km)</h1>}

          <Box my={3} p={3}>
            <HotelCardHomeScreen hotels={nearbyHotels} />
          </Box>

          <Box my={3} p={3}>
            <h1>All hotels</h1>
            <HotelCardHomeScreen hotels={hotels} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default HomeScreen;
