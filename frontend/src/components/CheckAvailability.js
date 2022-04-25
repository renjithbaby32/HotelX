import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { addDays, differenceInDays } from 'date-fns';
import React from 'react';
import { useDispatch } from 'react-redux';
import {
  clearAvailalbility,
  getAvailabilityMain,
  setDates,
} from '../features/booking/bookingSlice';

export const CheckAvailability = () => {
  const [checkIn, setCheckIn] = React.useState(new Date());
  const [checkOut, setCheckOut] = React.useState(addDays(new Date(), 1));
  const [dateError, setDateError] = React.useState(false);
  const [rooms, setRooms] = React.useState(1);

  const dispatch = useDispatch();

  const checkAvailabilityHandler = () => {
    if (!dateError) {
      dispatch(
        getAvailabilityMain({
          startDate: checkIn,
          endDate: checkOut,
          numberOfRooms: rooms,
          numberOfDays: differenceInDays(checkOut, checkIn),
        })
      );
      dispatch(setDates({ checkIn, checkOut }));
    }
  };

  return (
    <Box
      sx={{
        marginX: '16vw',
      }}
      my={3}
      p={3}
    >
      <Grid container spacing={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item xs={12} md={6} lg={3}>
            <DatePicker
              sx={{ width: '100%' }}
              label="Check-in date"
              value={checkIn}
              onChange={(newValue) => {
                dispatch(clearAvailalbility());
                if (
                  differenceInDays(newValue, checkOut) > 1 ||
                  differenceInDays(newValue, new Date()) < 1
                ) {
                  setDateError(true);
                } else {
                  setDateError(false);
                  setCheckIn(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <DatePicker
              sx={{ width: '100%' }}
              label="Check-out date"
              value={checkOut}
              onChange={(newValue) => {
                dispatch(clearAvailalbility());
                if (differenceInDays(newValue, checkIn) < 1) {
                  setDateError(true);
                } else {
                  setDateError(false);
                  setCheckOut(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <TextField
              fullWidth
              label="No. of rooms"
              select
              defaultValue="1"
              size="medium"
              color="secondary"
              helperText="Select number of rooms"
              value={rooms}
              onChange={(e) => {
                e.preventDefault();
                setRooms(e.target.value);
              }}
            >
              <MenuItem value="0">0</MenuItem>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
              <MenuItem value="5">5</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Button
              fullWidth
              onClick={checkAvailabilityHandler}
              style={{ marginTop: '8px' }}
              size="large"
              variant="contained"
            >
              Search
            </Button>
          </Grid>
        </LocalizationProvider>
      </Grid>
    </Box>
  );
};
