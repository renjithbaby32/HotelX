import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hotelOwnerLogin } from '../features/hotelOwners/hotelOwnerSlice';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import * as Yup from 'yup';
import { ErrorMessage, Form, Formik } from 'formik';

const HotelOwnerLogin = () => {
  const dispatch = useDispatch();

  const { hotelOwner } = useSelector((state) => state.hotelOwner);

  const navigate = useNavigate();

  useEffect(() => {
    if (hotelOwner) {
      navigate('/hotel-owner');
    }
  }, [navigate, hotelOwner]);

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = ({ email, password }) => {
    dispatch(hotelOwnerLogin({ email, password }));
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid e-mail').required('Required'),
    password: Yup.string().required('Required'),
  });

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
            Sign in to hotel owner account
          </Typography>
          <Box sx={{ mt: 1 }}>
            {/* {loginError && <Alert severity="error">{loginErrorMessage}</Alert>} */}
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form>
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
                  <ErrorMessage name="password">
                    {(error) => (
                      <Typography style={{ color: 'red' }}>{error}</Typography>
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
          <Grid container flexDirection={'column'}>
            <Grid item xs>
              <Link
                onClick={() => localStorage.removeItem('user')}
                to={'/register-hotel-owner'}
              >
                Own a hotel?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HotelOwnerLogin;
