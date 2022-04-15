import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../features/users/usersSlice';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Container,
  Box,
  Grid,
} from '@mui/material';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Paper sx={{ padding: '32px' }} elevation={2}>
        <Stack spacing={2}>
          <TextField
            label="E-mail"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
          />
          <TextField
            label="Password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            helperText={
              !password ? 'Required' : 'Do not share your password with anyone'
            }
          />
          <Stack display={'block'}>
            <Button
              variant="contained"
              size="large"
              onClick={(e) => {
                e.preventDefault();
                dispatch(userLogin({ email, password }));
              }}
            >
              login
            </Button>
          </Stack>
          <Link to={'/register'}>
            <Typography>New User?</Typography>
          </Link>
          <Link to={'/hotel-owner-login'}>
            <Typography
              onClick={(e) => {
                localStorage.removeItem('user');
              }}
            >
              Click here to login to hotel owner account
            </Typography>
          </Link>
        </Stack>
      </Paper>
    </Grid>
  );
};

export default UserLogin;
