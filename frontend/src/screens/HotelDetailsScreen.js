import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  AlertTitle,
  Button,
  MenuItem,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import {
  clearAvailalbility,
  clearBookingDetails,
  getAvailability,
} from '../features/booking/bookingSlice';
import { differenceInDays, addDays } from 'date-fns';
import { Card, Col, ListGroup, Row, Image } from 'react-bootstrap';
import ReactImageMagnify from 'react-image-magnify';
import { Message } from '../components/Message';

const HotelDetailsScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(
    addDays(new Date(), 1)
  );
  const [mainImage, setMainImage] = useState();
  const [numberOfBudgetRooms, setNumberOfBudgetRooms] = useState(1);
  const [numberOfPremiumRooms, setNumberOfPremiumRooms] = useState(0);
  const [dateError, setDateError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { hotelid } = useParams();
  const [hotel, setHotel] = useState({});

  const hotels = useSelector((state) => state.hotel.hotels);
  let { availability, bookingDetails, error } = useSelector(
    (state) => state.booking
  );

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    setHotel(hotels.find((hotel) => hotel._id === hotelid));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(clearBookingDetails());
      dispatch(clearAvailalbility());
    };
  }, [dispatch]);

  const selectImage = (url) => {
    setMainImage(url);
  };

  return (
    <>
      {dateError && (
        <Message variant="danger">Please select a valid date</Message>
      )}
      {error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {bookingDetails && (
            <Stack spacing={2}>
              <Alert variant="filled" severity="success">
                <AlertTitle> Booking Successful</AlertTitle>
                <Button
                  onClick={() => {
                    navigate(`/booking/${bookingDetails._id}`);
                  }}
                  color="inherit"
                >
                  See details
                </Button>
              </Alert>
            </Stack>
          )}

          <Row className="py-3">
            <Col md={6}>
              {/* <img style={{ width: '100%' }} src={hotel.mainImage} alt="" /> */}
              <ReactImageMagnify
                className="sample"
                {...{
                  smallImage: {
                    alt: 'Hotel display image',
                    isFluidWidth: true,
                    src: mainImage ? mainImage : hotel.mainImage,
                  },
                  largeImage: {
                    src: mainImage ? mainImage : hotel.mainImage,
                    width: 1200,
                    height: 1200,
                  },
                }}
              />
              <Row>
                {hotel.extraImages && hotel.extraImages.length > 0 && (
                  <Col>
                    <Image
                      onClick={(e) => {
                        e.preventDefault();
                        selectImage(hotel.mainImage);
                      }}
                      src={hotel.mainImage}
                      alt={hotel}
                      fluid
                    />
                  </Col>
                )}

                {hotel.extraImages &&
                  hotel.extraImages.length > 0 &&
                  hotel.extraImages.map((image, index) => {
                    return (
                      <Col key={index}>
                        <Image
                          onClick={(e) => {
                            e.preventDefault();
                            selectImage(image);
                          }}
                          src={image}
                          alt={image}
                          fluid
                        />
                      </Col>
                    );
                  })}
              </Row>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{hotel.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={hotel.stars || 0} readOnly></Rating>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6>
                    {hotel.city}, {hotel.state}
                  </h6>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6>Price starts from &#x20b9;{hotel.costPerDayBudget}</h6>
                </ListGroup.Item>
                {availability && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Budget rooms</Col>
                      <Col>
                        <strong>
                          {availability.maxAvailabilityOfBudgetRooms}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                {availability && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Premium rooms</Col>
                      <Col>
                        <strong>
                          {availability.maxAvailabilityOfPremiumRooms}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Budget rooms</Col>
                      <Col>
                        <strong>&#x20b9;{hotel.costPerDayBudget}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Premium rooms</Col>
                      <Col>
                        <strong>&#x20b9;{hotel.costPerDayPremium}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <DatePicker
                          label="Check-in date"
                          value={selectedDate}
                          onChange={(newValue) => {
                            dispatch(clearAvailalbility());
                            if (
                              differenceInDays(newValue, selectedEndDate) > 1 ||
                              differenceInDays(newValue, new Date()) < 1
                            ) {
                              setDateError(true);
                            } else {
                              setDateError(false);
                              setSelectedDate(newValue);
                            }
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <DatePicker
                          label="Check-out date"
                          value={selectedEndDate}
                          onChange={(newValue) => {
                            dispatch(clearAvailalbility());
                            if (differenceInDays(newValue, selectedDate) < 1) {
                              setDateError(true);
                            } else {
                              setDateError(false);
                              setSelectedEndDate(newValue);
                            }
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <TextField
                          label="No. of budget rooms"
                          select
                          size="small"
                          color="secondary"
                          helperText="Choose number of budget rooms"
                          value={numberOfBudgetRooms}
                          onChange={(e) => {
                            e.preventDefault();
                            setNumberOfBudgetRooms(e.target.value);
                          }}
                        >
                          <MenuItem value="0">0</MenuItem>
                          <MenuItem value="1">1</MenuItem>
                          <MenuItem value="2">2</MenuItem>
                          <MenuItem value="3">3</MenuItem>
                          <MenuItem value="4">4</MenuItem>
                          <MenuItem value="5">5</MenuItem>
                        </TextField>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <TextField
                          label="No. of premium rooms"
                          select
                          size="small"
                          color="secondary"
                          helperText="Choose number of premium rooms"
                          value={numberOfPremiumRooms}
                          onChange={(e) => {
                            e.preventDefault();
                            setNumberOfPremiumRooms(e.target.value);
                          }}
                        >
                          <MenuItem value="0">0</MenuItem>
                          <MenuItem value="1">1</MenuItem>
                          <MenuItem value="2">2</MenuItem>
                          <MenuItem value="3">3</MenuItem>
                          <MenuItem value="4">4</MenuItem>
                          <MenuItem value="5">5</MenuItem>
                        </TextField>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (!dateError) {
                          const numberOfDays = differenceInDays(
                            selectedEndDate,
                            selectedDate
                          );
                          dispatch(
                            getAvailability({
                              hotelid,
                              startDate: selectedDate,
                              endDate: selectedEndDate,
                              numberOfDays,
                            })
                          );
                        }
                      }}
                    >
                      Check availability
                    </Button>
                  </ListGroup.Item>

                  {availability && (
                    <ListGroup.Item>
                      <Button
                        variant={availability ? 'contained' : 'outlined'}
                        onClick={() => {
                          if (!dateError) {
                            if (user) {
                              const numberOfDays = differenceInDays(
                                selectedEndDate,
                                selectedDate
                              );
                              const amount =
                                (numberOfBudgetRooms * hotel.costPerDayBudget +
                                  numberOfPremiumRooms *
                                    hotel.costPerDayPremium) *
                                numberOfDays;
                              const booking = {
                                hotelid,
                                startDate: selectedDate,
                                endDate: selectedEndDate,
                                amount,
                                numberOfPremiumRoomsBooked:
                                  numberOfPremiumRooms,
                                numberOfBudgetRoomsBooked: numberOfBudgetRooms,
                                user,
                              };
                              localStorage.setItem(
                                'booking',
                                JSON.stringify(booking)
                              );
                              navigate('/payment');
                            } else {
                              navigate(`/login?redirect=/hotel/${hotelid}`);
                            }
                          }
                        }}
                      >
                        <Typography>Book now</Typography>
                      </Button>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>

          {/* <pre>{JSON.stringify(hotel, null, 2)}</pre> */}
        </LocalizationProvider>
      )}
    </>
  );
};

export default HotelDetailsScreen;
