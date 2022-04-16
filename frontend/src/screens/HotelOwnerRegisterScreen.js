import { Formik, Form as FormikForm } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FormContainer } from '../components/FormContainer';
import {
  hotelOwnerRegister,
  sendOTP,
  verifyOTP,
} from '../features/hotelOwners/hotelOwnerSlice';
import { Button, Form } from 'react-bootstrap';

const HotelOwnerRegisterScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { hotelOwner, OTPSent, OTPVerified } = useSelector(
    (state) => state.hotelOwner
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (hotelOwner) {
      navigate('/hotel-owner');
    }
  }, [hotelOwner]);

  return (
    <FormContainer>
      <Formik
        initialValues={{
          name: '',
          phone: '',
          password: '',
          email: '',
          otp: '',
        }}
        onSubmit={(values) => {
          if (OTPVerified) {
            dispatch(hotelOwnerRegister(values));
          }
        }}
      >
        {({ values, handleChange, handleBlur }) => (
          <FormikForm>
            <Form.Group>
              <Form.Label>Name</Form.Label>

              <Form.Control
                type="text"
                name="name"
                placeholder="Enter name"
                value={values.name}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Email</Form.Label>

              <Form.Control
                name="email"
                type="email"
                placeholder="Enter e-mail"
                value={values.email}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Phone</Form.Label>

              <Form.Control
                name="phone"
                type="number"
                placeholder="Enter phone number"
                value={values.phone}
                onChange={handleChange}
              ></Form.Control>
              <Button
                onClick={() => {
                  dispatch(sendOTP(values.phone));
                }}
                className="my-3"
              >
                Send OTP
              </Button>
            </Form.Group>

            <Form.Group>
              <Form.Label>
                {OTPVerified ? 'OTP Verified' : 'Enter OTP received'}
              </Form.Label>

              <Form.Control
                name="otp"
                type="number"
                placeholder="Enter OTP"
                value={values.otp}
                onChange={handleChange}
              ></Form.Control>
              <Button
                onClick={() => {
                  dispatch(
                    verifyOTP({ phone: values.phone, code: values.otp })
                  );
                }}
                className="my-3"
              >
                Verify OTP
              </Button>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>

              <Form.Control
                name="password"
                type="password"
                placeholder="Enter password"
                value={values.password}
                onChange={handleChange}
              ></Form.Control>
            </Form.Group>

            <Button type={'submit'}>Submit</Button>
          </FormikForm>
        )}
      </Formik>
    </FormContainer>
  );
};

export default HotelOwnerRegisterScreen;
