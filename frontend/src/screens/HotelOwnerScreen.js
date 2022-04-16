import React, { useEffect } from 'react';
import { useIdentity } from '../utils/identity';
import { useSelector, useDispatch } from 'react-redux';
import { getHotels } from '../features/hotelOwners/hotelOwnerSlice';
import { Col, Row } from 'react-bootstrap';
import { HotelCard } from '../components/HotelCard';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Stack } from '@mui/material';

export const HotelOwnerScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotelOwner } = useIdentity('hotelOwner');
  const { hotels } = useSelector((state) => state.hotelOwner);

  useEffect(() => {
    if (hotelOwner) {
      dispatch(getHotels(hotelOwner));
    }
  }, []);

  const viewMoreFunction = (hotelId) => {
    navigate(`/hotel-owner/upcoming/${hotelId}`);
  };

  return (
    <Stack spacing={3}>
      <Row>
        {hotels.map((hotel) => {
          return (
            <Col key={hotel._id} xs={11} sm={6} md={6} lg={6} xl={4}>
              <HotelCard viewMoreFunction={viewMoreFunction} hotel={hotel} />
            </Col>
          );
        })}
      </Row>
      <Link to={'/hotel/add'}>
        <Button variant="outlined">Add Hotel</Button>
      </Link>
    </Stack>
  );
};
