import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { userLogin } from '../features/users/usersSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userRegister } from '../features/users/usersSlice';
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

function Copyright(props) {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      {...props}
    >
      {'Copyright © '}
      <Link color='inherit' to='/'>
        HotelX
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const UserRegisterScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const initialValues = {
    email: '',
    password: '',
    name: '',
    phone: '',
  };

  const onSubmit = ({ email, password, phone, name }) => {
    dispatch(userRegister({ email, password, phone, name }));
  };
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid e-mail').required('Required'),
    password: Yup.string().required('Required'),
    name: Yup.string().required('Required'),
    phone: Yup.number().min(10, 'Must be 10 digits').required('Required'),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <Grid container component='main'>
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
          <Typography component='h1' variant='h5'>
            Register for a free account
          </Typography>
          <Box sx={{ mt: 1 }}>
            {/* {loginError && <Alert severity='error'>{loginErrorMessage}</Alert>} */}
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ values, handleChange, handleBlur }) => (
                <Form>
                  <ErrorMessage name='name'>
                    {(error) => (
                      <Typography style={{ color: 'red' }}>{error}</Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='name'
                    label='Name'
                    name='name'
                    autoFocus
                    onChange={handleChange}
                  />

                  <ErrorMessage name='email'>
                    {(error) => (
                      <Typography style={{ color: 'red' }}>{error}</Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    id='email'
                    label='Email Address'
                    name='email'
                    autoComplete='email'
                    autoFocus
                    onChange={handleChange}
                  />
                  <ErrorMessage name='phone'>
                    {(error) => (
                      <Typography style={{ color: 'red' }}>{error}</Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin='normal'
                    type={'number'}
                    required
                    fullWidth
                    id='phone'
                    label='Phone number'
                    name='phone'
                    autoFocus
                    onChange={handleChange}
                  />
                  <ErrorMessage name='password'>
                    {(error) => (
                      <Typography style={{ color: 'red' }}>{error}</Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin='normal'
                    required
                    fullWidth
                    name='password'
                    label='Password'
                    type='password'
                    id='password'
                    autoComplete='current-password'
                    onChange={handleChange}
                    helperText={
                      !values.password
                        ? 'Required'
                        : 'Do not share your password with anyone'
                    }
                  />
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Register
                  </Button>
                </Form>
              )}
            </Formik>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserRegisterScreen;
