import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userRegister } from '../features/users/usersSlice';
import { Formik, Form as FormikForm } from 'formik';
import { TextField, Button } from '@mui/material';
import { FormContainer } from '../components/FormContainer';
import { Form } from 'react-bootstrap';

const UserRegisterScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  return (
    <FormContainer>
      <Formik
        initialValues={{ name: '', phone: '', password: '', email: '' }}
        onSubmit={(values) => {
          dispatch(userRegister(values));
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

            <Button variant={'contained'} type={'submit'}>
              Submit
            </Button>
          </FormikForm>
        )}
      </Formik>
    </FormContainer>
  );
};

export default UserRegisterScreen;
