import React, { useEffect } from 'react';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getBookings } from '../features/users/usersSlice';
import { useIdentity } from '../utils/identity';
import { format } from 'date-fns';
export const BookingsScreen = () => {
  const dispatch = useDispatch();
  const { user } = useIdentity('user');
  const { bookings } = useSelector((state) => state.user);

  bookings && bookings.map((booking) => console.log(booking));

  useEffect(() => {
    dispatch(getBookings(user._id));
  }, []);

  return (
    <>
      {bookings &&
        bookings.map((booking) => (
          <Card sx={{ minWidth: 275 }}>
            <CardMedia
              component="img"
              height="250"
              image={booking.hotel.mainImage}
              alt="green iguana"
            />
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                {booking.hotel.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {booking.hotel.city}, {booking.hotel.state}
              </Typography>
              <Typography variant="body2">
                {format(new Date(booking.checkInDate), 'EEEE-MMM-dd-yyyy')}
              </Typography>
              <Typography variant="body2">
                {format(new Date(booking.checkOutDate), 'EEEE-MMM-dd-yyyy')}
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions> */}
          </Card>
        ))}
    </>
  );
};
