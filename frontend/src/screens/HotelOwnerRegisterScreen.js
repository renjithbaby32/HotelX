import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  hotelOwnerRegister,
  sendOTP,
  verifyOTP,
} from '../features/hotelOwners/hotelOwnerSlice';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  CssBaseline,
  Avatar,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const HotelOwnerRegisterScreen = () => {
  const dispatch = useDispatch();
  const { hotelOwner, OTPSent, OTPVerified, OTPVerificationFailed } =
    useSelector((state) => state.hotelOwner);

  const initialValues = {
    email: '',
    password: '',
    name: '',
    phone: '',
    otp: '',
  };

  const onSubmit = ({ email, password, phone, name, otp }) => {
    dispatch(hotelOwnerRegister({ email, password, phone, name, otp }));
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid e-mail').required('Required'),
    password: Yup.string().required('Required'),
    name: Yup.string().required('Required'),
    phone: Yup.number().min(10, 'Must be 10 digits').required('Required'),
    otp: Yup.number().required('Required'),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (hotelOwner) {
      navigate('/hotel-owner');
    }
  }, [hotelOwner]);

  return (
    <Grid container component="main">
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register for a free account
          </Typography>
          <Box sx={{ mt: 1 }}>
            {OTPVerificationFailed && (
              <Alert severity="error">{'Wrong OTP'}</Alert>
            )}
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form>
                  <ErrorMessage name="name">
                    {(error) => (
                      <Typography style={{ color: 'red' }}>{error}</Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoFocus
                    onChange={handleChange}
                  />

                  <ErrorMessage name="email">
                    {(error) => (
                      <Typography style={{ color: 'red' }}>{error}</Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={handleChange}
                  />
                  <ErrorMessage name="phone">
                    {(error) => (
                      <Typography style={{ color: 'red' }}>{error}</Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type={'number'}
                    required
                    fullWidth
                    id="phone"
                    label="Phone number"
                    name="phone"
                    autoFocus
                    onChange={handleChange}
                  />
                  {!OTPVerified && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        dispatch(sendOTP(values.phone));
                      }}
                      className="my-3"
                    >
                      Send OTP
                    </Button>
                  )}

                  {OTPSent && (
                    <>
                      <ErrorMessage name="otp">
                        {(error) => (
                          <Typography style={{ color: 'red' }}>
                            {error}
                          </Typography>
                        )}
                      </ErrorMessage>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="otp"
                        label="Enter OTP received"
                        type="number"
                        id="otp"
                        onChange={handleChange}
                      />
                    </>
                  )}

                  {OTPSent && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        dispatch(
                          verifyOTP({ phone: values.phone, code: values.otp })
                        );
                      }}
                      className="my-3"
                    >
                      Verify OTP
                    </Button>
                  )}

                  {OTPVerified && (
                    <>
                      <ErrorMessage name="password">
                        {(error) => (
                          <Typography style={{ color: 'red' }}>
                            {error}
                          </Typography>
                        )}
                      </ErrorMessage>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                        helperText={
                          !values.password
                            ? 'Required'
                            : 'Do not share your password with anyone'
                        }
                      />
                    </>
                  )}

                  {OTPVerified && (
                    <>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HotelOwnerRegisterScreen;
