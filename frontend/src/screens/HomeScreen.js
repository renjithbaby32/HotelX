import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLocationToLocalStorage } from '../features/userLocation/userLocationSlice';
import { getHotels, getNearbyHotels } from '../features/hotel/hotelSlice';
import { HotelCard } from '../components/HotelCard';
import { Row, Col } from 'react-bootstrap';
import { useIdentity } from '../utils/identity';
import { useNavigate } from 'react-router-dom';
import { CheckAvailability } from '../components/CheckAvailability';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, nearbyHotels } = useSelector((state) => state.hotel);
  const { totalAvailability } = useSelector((state) => state.booking);
  const { hotelOwner } = useIdentity();

  useEffect(() => {
    if (hotelOwner) {
      navigate('/hotel-owner');
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
      {totalAvailability ? (
        <>
          <h1>Hotels available on given dates</h1>
          <Row>
            {totalAvailability.map((hotel) => {
              return (
                <Col key={hotel._id} xs={11} sm={6} md={6} lg={6} xl={4}>
                  <HotelCard hotel={hotel} />
                </Col>
              );
            })}
          </Row>
        </>
      ) : (
        <>
          {nearbyHotels.length > 0 && <h1>Nearby hotels (within 100km)</h1>}

          <Row>
            {nearbyHotels.map((hotel) => {
              return (
                <Col key={hotel._id} xs={11} sm={6} md={6} lg={6} xl={4}>
                  <HotelCard hotel={hotel} />
                </Col>
              );
            })}
          </Row>

          <h1>All hotels</h1>
          <Row>
            {hotels.map((hotel) => {
              return (
                <Col key={hotel._id} xs={11} sm={6} md={6} lg={6} xl={4}>
                  <HotelCard hotel={hotel} />
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
