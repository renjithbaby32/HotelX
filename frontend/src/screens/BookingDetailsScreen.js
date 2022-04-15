import React, { useEffect } from 'react';
import { Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  clearBookingDetails,
  getBookingDetails,
} from '../features/booking/bookingSlice';
import { format } from 'date-fns';

export const BookingDetailsScreen = () => {
  const dispatch = useDispatch();
  const { bookingid } = useParams();
  const { bookingDetails, loading } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(
      getBookingDetails({
        user,
        bookingid,
      })
    );

    return () => {
      dispatch(clearBookingDetails());
    };
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h4>Booking details</h4>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <img
                    width={'100%'}
                    src={bookingDetails.hotel.mainImage}
                    alt=""
                  />
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <p>
                    Hotel name: <strong>{bookingDetails.hotel.name}</strong>
                  </p>
                </ListGroupItem>
                <ListGroupItem>
                  <p>
                    Check in date :{' '}
                    {format(
                      new Date(bookingDetails.checkInDate),
                      'EEEE-MMM-dd-yyyy'
                    )}
                  </p>
                </ListGroupItem>
                <ListGroupItem>
                  <p>
                    Check out date :{' '}
                    {format(
                      new Date(bookingDetails.checkOutDate),
                      'EEEE-MMM-dd-yyyy'
                    )}
                  </p>
                </ListGroupItem>
                <ListGroupItem>
                  {bookingDetails.amountPaid === 0 ? (
                    <p>Amount due: &#x20b9;{bookingDetails.amount}</p>
                  ) : (
                    <p>Amount paid: &#x20b9;{bookingDetails.amountPaid}</p>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};
