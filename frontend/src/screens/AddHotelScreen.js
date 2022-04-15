import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form as FormikForm, ErrorMessage } from 'formik';
import { Button } from '@mui/material';
import { FormContainer } from '../components/FormContainer';
import { Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { addHotel } from '../features/hotel/hotelSlice';
import axios from 'axios';
import { useIdentity } from '../utils/identity';

const initialValues = {
  name: '',
  state: '',
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
  const { hotelOwner } = useIdentity('hotelOwner');
  if (hotelOwner) {
    var { _id: hotelOwnerId } = hotelOwner;
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [extraImages, setExtraImages] = useState([]);
  const [mainImage, setMainImage] = useState('');

  /**
   * Gets the coordinates of the hotel from the address prodived using google maps geocoding API.
   */
  useEffect(() => {
    const getCoordinates = async () => {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAgCuggYwRwESeTMcghnug3oDmgi2-JN-Y`,
        {
          params: {
            address: 'Poodamkallu',
            key: 'AIzaSyAgCuggYwRwESeTMcghnug3oDmgi2-JN-Y',
          },
        }
      );
    };

    getCoordinates();
  }, []);

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
    formData.set('mainImage', mainImage);
    formData.set('coordinates', coordinates);
    formData.set('hotelOwnerId', hotelOwnerId);
    extraImages.forEach((image) => {
      formData.append('extraImages', image);
    });

    dispatch(addHotel(formData));
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
    <FormContainer>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, handleBlur }) => (
          <FormikForm>
            <Form.Group>
              <ErrorMessage name="name">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                value={values.name}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="state">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="state">State</Form.Label>

              <Form.Control
                name="state"
                type="text"
                placeholder="Enter the name of the state"
                value={values.state}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="city">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="city">City</Form.Label>

              <Form.Control
                name="city"
                type="text"
                placeholder="Enter city name"
                value={values.city}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="postalCode">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="postalCode">Postal Code</Form.Label>

              <Form.Control
                name="postalCode"
                type="number"
                placeholder="Enter postal code"
                value={values.postalCode}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="stars">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="stars">Star rating</Form.Label>

              <Form.Control
                name="stars"
                type="number"
                placeholder="Enter star rating"
                value={values.stars}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="costPerDayBudget">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="costPerDayBudget">
                Per day cost of budget rooms
              </Form.Label>

              <Form.Control
                name="costPerDayBudget"
                type="number"
                placeholder="Enter cost per day of budget rooms"
                value={values.costPerDayBudget}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="costPerDayPremium">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="costPerDayPremium">
                Per day cost of premium rooms
              </Form.Label>

              <Form.Control
                name="costPerDayPremium"
                type="number"
                placeholder="Enter cost per day of premium rooms"
                value={values.costPerDayPremium}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="discountPercentage">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="discount">Discount in %</Form.Label>

              <Form.Control
                name="discountPercentage"
                type="number"
                placeholder="Enter discount in %"
                value={values.discountPercentage}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="totalNumberOfRooms">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="totalNumberOfRooms">
                Total number of rooms
              </Form.Label>

              <Form.Control
                name="totalNumberOfRooms"
                type="number"
                placeholder="Enter total number of rooms"
                value={values.totalNumberOfRooms}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="numberOfBudgetRooms">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="numberOfBudgetRooms">
                Number of budget rooms
              </Form.Label>

              <Form.Control
                name="numberOfBudgetRooms"
                type="number"
                placeholder="Enter number of budget rooms"
                value={values.numberOfBudgetRooms}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="numberOfPremiumRooms">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="numberOfPremiumRooms">
                Number of premium rooms
              </Form.Label>

              <Form.Control
                name="numberOfPremiumRooms"
                type="number"
                placeholder="Enter number of premium rooms"
                value={values.numberOfPremiumRooms}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <ErrorMessage name="mainImage">
                {(error) => <div style={{ color: 'red' }}>{error}</div>}
              </ErrorMessage>
              <Form.Label htmlFor="mainImage">Display image</Form.Label>

              <Form.Control
                name="mainImage"
                type="file"
                value={values.mainImage}
                onChange={multiFileUploadHandler}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Add extra images</Form.Label>
              <Form.Control
                name="extraImages"
                type="file"
                multiple
                value={values.extraImages}
                onChange={multiFileUploadHandler}
              ></Form.Control>
            </Form.Group>

            <Button variant={'contained'} type={'submit'}>
              Submit
            </Button>
          </FormikForm>
        )}
      </Formik>
    </FormContainer>
  );
};
