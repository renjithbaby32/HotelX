import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HotelCard = ({ hotel, viewMoreFunction }) => {
  const navigate = useNavigate();

  const viewMoreHandler = () => {
    navigate(`/hotel/${hotel._id}`);
  };

  return (
    <div>
      <Card>
        <CardMedia
          component="img"
          height="320"
          image={hotel.mainImage}
          alt="unsplash image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {hotel.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Expedita,
            molestiae quis quaerat officia ducimus sequi delectus impedit id et
            cumque dignissimos labore veniam natus velit?
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={
              viewMoreFunction
                ? (e) => viewMoreFunction(hotel._id)
                : viewMoreHandler
            }
            variant="outlined"
          >
            View more
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};
