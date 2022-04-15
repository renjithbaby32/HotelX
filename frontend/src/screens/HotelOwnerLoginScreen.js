import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hotelOwnerLogin } from '../features/hotelOwners/hotelOwnerSlice';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const HotelOwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const { hotelOwner } = useSelector((state) => state.hotelOwner);

  const navigate = useNavigate();

  useEffect(() => {
    if (hotelOwner) {
      navigate('/hotel-owner');
    }
  }, [hotelOwner]);

  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Typography variant={'h6'}>Hotel owner login</Typography>
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
                !password
                  ? 'Required'
                  : 'Do not share your password with anyone'
              }
            />
            <Stack display={'block'}>
              <Button
                variant="contained"
                size="large"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(hotelOwnerLogin({ email, password }));
                }}
              >
                Login
              </Button>
            </Stack>
            <Link to={'/hotel-owner-register'}>
              <Typography>Own a hotel?</Typography>
            </Link>
          </Stack>
        </Paper>
      </Grid>
    </div>
  );
};

export default HotelOwnerLogin;
