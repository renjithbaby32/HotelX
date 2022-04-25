import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedPost } from '../features/hotel/hotelSlice';
import { Link } from 'react-router-dom';

export const MainFeaturedPost = () => {
  const dispatch = useDispatch();
  const { featuredPost } = useSelector((state) => state.hotel);
  useEffect(() => {
    dispatch(getFeaturedPost());
  }, []);

  return (
    <>
      {featuredPost && (
        <Box my={3} p={3}>
          <Paper
            sx={{
              position: 'relative',
              backgroundColor: 'grey.800',
              color: '#fff',
              mb: 4,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: `url(${featuredPost.hotel.mainImage})`,
            }}
          >
            {/* Increase the priority of the hero background image */}
            {
              <img
                style={{ display: 'none' }}
                src={featuredPost.hotel.mainImage}
              />
            }
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: 'rgba(0,0,0,.3)',
              }}
            />

            <Grid container>
              <Grid item md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    p: { xs: 3, md: 6 },
                    pr: { md: 0 },
                  }}
                >
                  <Typography
                    component="h1"
                    variant="h3"
                    color="inherit"
                    gutterBottom
                  >
                    {featuredPost.hotel.name}
                  </Typography>
                  <Typography variant="h5" color="inherit" paragraph>
                    {featuredPost.description}
                  </Typography>
                  <Link to={`/hotel/${featuredPost.hotel._id}`}>
                    <Button variant="contained" color="secondary">
                      Book Now
                    </Button>
                  </Link>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
    </>
  );
};
