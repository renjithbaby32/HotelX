import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form as FormikForm, ErrorMessage } from 'formik';
import {
  Avatar,
  Paper,
  Box,
  Button,
  CssBaseline,
  Grid,
  Typography,
  TextField,
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import * as Yup from 'yup';
import {
  addHotel,
  editHotel,
  resetNewHotelAddedState,
  resetNewHotelEditedState,
} from '../features/hotel/hotelSlice';
import { useIdentity } from '../utils/identity';
import { addNotification } from '../features/admin/adminSlice';
import mapboxgl from 'mapbox-gl';
import { getHotel } from '../features/hotel/hotelSlice';

mapboxgl.accessToken =
  'pk.eyJ1IjoicmVuaml0aGJhYnkiLCJhIjoiY2wyYmU4bWlrMDNlODNpbnV5MW9pZDMyNCJ9.5VetjmUxmKj4oaT21Yfh9g';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  state: Yup.string().required('Required'),
  city: Yup.string().required('Required'),
  postalCode: Yup.string().required('Required'),
  stars: Yup.string().required('Required'),
  costPerDayBudget: Yup.number()
    .required('Required')
    .min(100, 'Must be at least 100'),
  costPerDayPremium: Yup.number().required('Required'),
  discountPercentage: Yup.number().required('Required'),
  totalNumberOfRooms: Yup.number().required('Required'),
  numberOfBudgetRooms: Yup.number().required('Required'),
  numberOfPremiumRooms: Yup.number().required('Required'),
});

export const AddHotelScreen = () => {
  const { hotelid } = useParams();
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(76.26);
  const [lat, setLat] = useState(9.93);
  const [zoom, setZoom] = useState(9);

  const [hotelDetails, setHotelDetails] = useState({});

  const initialValues = {
    name: 'Bad',
    state: 'Kerala',
    city: '',
    postalCode: '',
    stars: '',
    costPerDayBudget: '',
    costPerDayPremium: '',
    discountPercentage: 0,
    totalNumberOfRooms: 0,
    hasPremiumRooms: true,
    numberOfBudgetRooms: 0,
    numberOfPremiumRooms: 0,
    coordinates: [0, 0],
  };

  useEffect(() => {
    if (hotelid) {
      dispatch(getHotel(hotelid));
    }
  }, []);

  useIdentity('hotelOwner');

  const { hotelOwner } = useSelector((state) => state.hotelOwner);
  const { hotel } = useSelector((state) => state.hotel);

  useEffect(() => {
    if (hotel) {
      setHotelDetails({
        name: hotel.name,
        state: hotel.state,
        city: hotel.city,
        postalCode: hotel.postalCode,
        stars: hotel.stars,
        costPerDayBudget: hotel.costPerDayBudget,
        costPerDayPremium: hotel.costPerDayPremium,
        discountPercentage: hotel.discountPercentage,
        totalNumberOfRooms: hotel.totalNumberOfRooms,
        hasPremiumRooms: hotel.hasPremiumRooms,
        numberOfBudgetRooms: hotel.numberOfBudgetRooms,
        numberOfPremiumRooms: hotel.numberOfPremiumRooms,
        coordinates: [
          hotel.coordinates.coordinates[0],
          hotel.coordinates.coordinates[1],
        ],
      });
    }
  }, [hotel]);

  if (hotelOwner) {
    var { _id: hotelOwnerId } = hotelOwner;
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { newHotelAdded, hotelEdited } = useSelector((state) => state.hotel);

  const [extraImages, setExtraImages] = useState([]);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });
  }, []);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (newHotelAdded) {
      dispatch(
        addNotification({
          title: `New Hotel Added by ${hotelOwner.name}`,
          description: `Go to hotels to see more details`,
        })
      );
      navigate('/hotel-owner');
    } else if (hotelEdited) {
      navigate('/hotel-owner');
    }

    return () => {
      dispatch(resetNewHotelAddedState());
      dispatch(resetNewHotelEditedState());
    };
  }, [newHotelAdded, hotelEdited]);

  const onSubmit = ({
    name,
    state,
    city,
    postalCode,
    stars,
    costPerDayBudget,
    costPerDayPremium,
    discountPercentage,
    totalNumberOfRooms,
    numberOfBudgetRooms,
    numberOfPremiumRooms,
    coordinates,
  }) => {
    console.log(
      name,
      state,
      city,
      postalCode,
      stars,
      costPerDayBudget,
      costPerDayPremium,
      discountPercentage,
      totalNumberOfRooms,
      numberOfBudgetRooms,
      numberOfPremiumRooms,
      coordinates,
      mainImage,
      extraImages
    );

    const formData = new FormData();
    formData.set('name', name);
    formData.set('state', state);
    formData.set('city', city);
    formData.set('postalCode', postalCode);
    formData.set('stars', stars);
    formData.set('costPerDayBudget', costPerDayBudget);
    formData.set('costPerDayPremium', costPerDayPremium);
    formData.set('discountPercentage', discountPercentage);
    formData.set('totalNumberOfRooms', totalNumberOfRooms);
    formData.set('numberOfBudgetRooms', numberOfBudgetRooms);
    formData.set('numberOfPremiumRooms', numberOfPremiumRooms);
    formData.set('coordinates', [lng, lat]);
    formData.set('hotelOwnerId', hotelOwnerId);
    if (!hotelid) {
      formData.set('mainImage', mainImage);
      extraImages.forEach((image) => {
        formData.append('extraImages', image);
      });
      dispatch(addHotel(formData));
    } else {
      formData.set('hotelId', hotelid);
      dispatch(editHotel(formData));
    }
  };

  const multiFileUploadHandler = async (e) => {
    if (e.target.files.length === 1) {
      const mainImage = e.target.files[0];
      setMainImage('');
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setMainImage(reader.result);
        }
      };
      reader.readAsDataURL(mainImage);
    } else {
      const files = Array.from(e.target.files);
      setExtraImages([]);

      files.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (reader.readyState === 2) {
            setExtraImages((oldArray) => [...oldArray, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <Grid container component="main">
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12} component={Paper} elevation={6}>
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
            <HotelIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {hotel ? 'Edit Hotel' : 'Add Hotel'}
          </Typography>
          <Box sx={{ mt: 1 }}>
            {/* {loginError && <Alert severity='error'>{loginErrorMessage}</Alert>} */}
            <Formik
              initialValues={hotel ? hotelDetails : initialValues}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
              enableReinitialize
            >
              {({ values, handleChange, handleBlur }) => (
                <FormikForm>
                  <ErrorMessage style={{}} name="name">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="text"
                    fullWidth
                    name="name"
                    placeholder="Enter name of the hotel"
                    autoFocus
                    value={values.name}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="state">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="text"
                    fullWidth
                    name="state"
                    placeholder="State"
                    autoFocus
                    value={values.state}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="city">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="text"
                    fullWidth
                    name="city"
                    placeholder="City"
                    autoFocus
                    value={values.city}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="postalCode">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    name="postalCode"
                    placeholder="Postal Code"
                    autoFocus
                    value={values.postalCode}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="stars">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    name="stars"
                    placeholder="Star Rating (1-5)"
                    autoFocus
                    value={values.stars}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="costPerDayBudget">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    name="costPerDayBudget"
                    placeholder="Budget Rooms Per Day Cost"
                    autoFocus
                    value={values.costPerDayBudget}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="costPerDayPremium">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    name="costPerDayPremium"
                    placeholder="Premium Rooms Per Day Cost"
                    autoFocus
                    value={values.costPerDayPremium}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="discountPercentage">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    name="discountPercentage"
                    placeholder="Discount in percentage"
                    autoFocus
                    value={values.discountPercentage}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="totalNumberOfRooms">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    name="totalNumberOfRooms"
                    placeholder="Total number of rooms"
                    autoFocus
                    value={values.totalNumberOfRooms}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="numberOfBudgetRooms">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    name="numberOfBudgetRooms"
                    placeholder="Number of budget rooms"
                    autoFocus
                    value={values.numberOfBudgetRooms}
                    onChange={handleChange}
                  ></TextField>

                  <ErrorMessage name="numberOfPremiumRooms">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="number"
                    fullWidth
                    name="numberOfPremiumRooms"
                    placeholder="Number of Premium rooms"
                    autoFocus
                    value={values.numberOfPremiumRooms}
                    onChange={handleChange}
                  ></TextField>

                  {!mainImage && hotel && hotel.mainImage && (
                    <div>
                      <img src={hotel.mainImage} style={{ width: '32%' }} />
                    </div>
                  )}

                  {mainImage && (
                    <div>
                      <img src={mainImage} style={{ width: '32%' }} />
                      <Button
                        onClick={() => {
                          setMainImage(null);
                          values.mainImage = null;
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}

                  <ErrorMessage name="mainImage">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="file"
                    fullWidth
                    name="mainImage"
                    placeholder="Display image"
                    autoFocus
                    value={values.mainImage}
                    onChange={multiFileUploadHandler}
                  ></TextField>

                  <ErrorMessage name="extraImages">
                    {(error) => (
                      <Typography
                        style={{ color: 'red', marginBottom: '-16px' }}
                      >
                        {error}
                      </Typography>
                    )}
                  </ErrorMessage>
                  <TextField
                    margin="normal"
                    type="file"
                    fullWidth
                    multiple
                    name="extraImages"
                    placeholder="Extra images"
                    autoFocus
                    value={values.extraImages}
                    onChange={multiFileUploadHandler}
                  ></TextField>

                  <div>
                    <div
                      style={{
                        backgroundColor: 'rgba(35, 55, 75, 0.9)',
                        color: '#fff',
                        padding: '6px 12px',
                        fontFamily: 'monospace',
                        zIndex: 1,
                        // position: 'absolute',
                        top: 0,
                        left: 0,
                        margin: '12px',
                        borderRadius: '4px',
                      }}
                      className="sidebar"
                    >
                      Longitude: {lng} | Latitude: {lat}
                    </div>
                    <div
                      ref={mapContainer}
                      style={{ height: '500px' }}
                      className="map-container"
                    />
                  </div>

                  <Button variant={'contained'} type={'submit'}>
                    Submit
                  </Button>
                </FormikForm>
              )}
            </Formik>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
