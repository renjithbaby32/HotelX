import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form as FormikForm, ErrorMessage } from 'formik';
import {
  Avatar,
  Paper,
  Box,
  Button,
  CssBaseline,
  Grid,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material';
import * as Yup from 'yup';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import {
  addAdvertisement,
  getHotels,
  clearAdvertisement,
} from '../features/hotelOwners/hotelOwnerSlice';
import axios from 'axios';

const initialValues = {
  description: '',
  numberOfHits: 0,
};

const validationSchema = Yup.object({
  description: Yup.string().required('Required'),
  numberOfHits: Yup.number().required('Required'),
});

export const AddPromotionScreen = () => {
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [amount, setAmount] = useState(0);
  console.log(amount);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const dispatch = useDispatch();

  const { hotels, hotelOwner, advertisement } = useSelector(
    (state) => state.hotelOwner
  );

  useEffect(() => {
    dispatch(getHotels(hotelOwner));
  }, []);

  useEffect(() => {
    if (advertisement) {
      navigate('/hotel-owner');
    }

    return () => {
      dispatch(clearAdvertisement());
    };
  }, [advertisement]);

  const onSubmit = (values) => {
    let { description, numberOfHits } = values;
    numberOfHits = Number(numberOfHits);
    makePayment(hotel, description, numberOfHits);
  };

  const paymentMethodOptions = ['Razorpay', 'Paypal'];

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const makePayment = (hotel, description, numberOfHits) => {
    if (paymentMethod === 'Razorpay') {
      async function showRazorpay() {
        const res = await loadScript(
          'https://checkout.razorpay.com/v1/checkout.js'
        );

        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }

        const { data } = await axios.post(
          `/api/v1/feature/payment/razorpay`,
          { amount: amount * 10 },
          {
            headers: {
              Authorization: `Bearer ${hotelOwner.token}`,
            },
          }
        );

        const options = {
          key: 'rzp_test_w4t1UiRN2QYw07',
          currency: data.currency,
          amount: data.amount.toString(),
          booking_id: data.id,
          name: 'HotelX',
          description: 'Make the payment to complete the process',
          image: '',
          handler: async (response) => {
            dispatch(
              addAdvertisement({
                hotel,
                description,
                numberOfHits,
              })
            );

            alert('Transaction successful');
          },
          prefill: {
            name: hotelOwner.name,
            email: hotelOwner.email,
            phone_number: 1111111111,
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }

      showRazorpay();
    }
  };

  return (
    <Grid container component="main">
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12} component={Paper} elevation={6}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AddBusinessIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add a featured post
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ values, handleChange, handleBlur }) => (
                <FormikForm>
                  <ErrorMessage name="hotel">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    label="Select the hotel"
                    select
                    size="medium"
                    fullWidth
                    color="secondary"
                    helperText="Select number of rooms"
                    value={values.hotel}
                    defaultValue={hotels[0]}
                    onChange={(e) => {
                      setHotel(e.target.value);
                    }}
                  >
                    {hotels.map((hotel) => {
                      if (hotel.isActive) {
                        return (
                          <MenuItem key={hotel._id} value={hotel._id}>
                            {hotel.name}
                          </MenuItem>
                        );
                      }
                    })}
                  </TextField>

                  <ErrorMessage name="description">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="text"
                    fullWidth
                    name="description"
                    placeholder="Enter description, e.g. Best hotel in town"
                    autoFocus
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="numberOfHits">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    name="numberOfHits"
                    placeholder="Enter the number of times this post should be displayed"
                    autoFocus
                    onChange={(e) => {
                      setAmount(Math.floor(0.32 * values.numberOfHits));
                      values.numberOfHits = e.target.value;
                    }}
                  ></TextField>

                  <ErrorMessage name="paymentMethod">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    label="Select the payment method"
                    select
                    size="medium"
                    fullWidth
                    color="secondary"
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                    }}
                  >
                    {paymentMethodOptions.map((paymentMethod) => {
                      return (
                        <MenuItem key={paymentMethod} value={paymentMethod}>
                          {paymentMethod}
                        </MenuItem>
                      );
                    })}
                  </TextField>

                  <Box marginY={3}>
                    <Button
                      size={'large'}
                      variant={'contained'}
                      type={'submit'}
                    >
                      Submit and Pay now
                    </Button>
                  </Box>

                  <Box marginY={3}>
                    {values.numberOfHits > 0 && (
                      <Typography>
                        Estimated cost is &#x20b9;
                        {Math.floor(0.32 * values.numberOfHits)}
                      </Typography>
                    )}
                  </Box>
                </FormikForm>
              )}
            </Formik>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
