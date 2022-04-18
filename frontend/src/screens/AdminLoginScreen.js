import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { adminLogin } from '../features/admin/adminSlice';

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" to="/">
        HotelX
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export const AdminLoginScreen = () => {
  const dispatch = useDispatch();

  const { admin, loginError, loginErrorMessage } = useSelector(
    (state) => state.admin
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate('/admin');
    }
  }, [admin]);

  const initialValues = {
    email: '',
    password: '',
  };
  const onSubmit = ({ email, password }) => {
    dispatch(adminLogin({ email, password }));
  };
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid e-mail'),
    password: Yup.string().required('Required'),
  });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
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
            Sign in to Admin Account
          </Typography>
          <Box sx={{ mt: 1 }}>
            {loginError && <Alert severity="error">{loginErrorMessage}</Alert>}
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
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
