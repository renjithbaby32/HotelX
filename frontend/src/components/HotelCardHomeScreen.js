import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  Grid,
  Rating,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fCurrency } from '../utils/formatNumber';
import Label from '../components/Label';
import ColorPreview from '../components/color-utils/ColorPreview';
import StarIcon from '@mui/icons-material/Star';
const HotelImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

export const HotelCardHomeScreen = ({ hotels }) => {
  return (
    <Grid container spacing={3}>
      {hotels.map((hotel) => {
        const {
          name,
          mainImage,
          state,
          city,
          stars,
          rating,
          discountPercentage,
          costPerDayBudget,
        } = hotel;
        return (
          <Grid key={hotel._id} item xs={12} sm={6} md={3}>
            <Card>
              <Box sx={{ pt: '100%', position: 'relative' }}>
                <Label
                  endIcon={<StarIcon />}
                  variant="filled"
                  color={'success'}
                  sx={{
                    zIndex: 9,
                    top: 16,
                    position: 'absolute',
                    textTransform: 'uppercase',
                  }}
                >
                  {stars}
                </Label>
                {discountPercentage > 0 && (
                  <Label
                    variant="filled"
                    color={'info'}
                    sx={{
                      zIndex: 9,
                      top: 16,
                      right: 16,
                      position: 'absolute',
                      textTransform: 'uppercase',
                    }}
                  >
                    {discountPercentage}% OFF
                  </Label>
                )}
                <HotelImgStyle alt={name} src={mainImage} />
              </Box>

              <Stack spacing={2} sx={{ p: 3 }}>
                <Link
                  to={`/hotel/${hotel._id}`}
                  color="inherit"
                  underline="hover"
                  component={RouterLink}
                >
                  <Typography variant="subtitle2" noWrap>
                    {name}
                  </Typography>
                </Link>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle1">
                    {rating > 0 && (
                      <Rating
                        name="read-only"
                        value={rating}
                        precision={0.5}
                        readOnly
                      />
                    )}
                  </Typography>

                  {discountPercentage > 0 ? (
                    <Typography variant="subtitle1">
                      &#x20b9;
                      {fCurrency(
                        (costPerDayBudget * (100 - discountPercentage)) / 100
                      )}
                      &nbsp;
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{
                          color: 'text.disabled',
                          textDecoration: 'line-through',
                        }}
                      >
                        {costPerDayBudget && fCurrency(costPerDayBudget)}
                      </Typography>
                    </Typography>
                  ) : (
                    <Typography>
                      &#x20b9;
                      {fCurrency(costPerDayBudget)}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

HotelCardHomeScreen.propTypes = {
  hotels: PropTypes.array.isRequired,
};
