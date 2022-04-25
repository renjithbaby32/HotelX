import React, { useState } from 'react';
import { FormContainer } from '../components/FormContainer';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bookRooms } from '../features/booking/bookingSlice';
import { Alert, AlertTitle, Stack } from '@mui/material';
import axios from 'axios';
import { useIdentity } from '../utils/identity';

export const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  useIdentity('user');

  const booking = JSON.parse(localStorage.getItem('booking'));

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  const makePayment = () => {
    if (paymentMethod === 'Razorpay') {
      async function showRazorpay() {
        const res = await loadScript(
          'https://checkout.razorpay.com/v1/checkout.js'
        );

        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }

        const { data } = await axios.post(
          `/api/v1/booking/payment/razorpay`,
          { booking },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const options = {
          key: 'rzp_test_w4t1UiRN2QYw07',
          currency: data.currency,
          amount: data.amount.toString(),
          booking_id: data.id,
          name: 'HotelX',
          description: 'Make the payment to complete the process',
          image: '',
          handler: async (response) => {
            // await axios.post(`/booking/razorpay/success/${booking._id}`);
            dispatch(
              bookRooms({
                ...booking,
                amountPaid: booking.amount,
                paymentMethod,
              })
            );

            alert('Transaction successful');
          },
          prefill: {
            name: booking.user.name,
            email: booking.user.email,
            phone_number: 1111111111,
          },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }

      showRazorpay();
    }
  };

  let { availability, bookingDetails, error } = useSelector(
    (state) => state.booking
  );

  const submitHandler = (e) => {
    e.preventDefault();
    if (paymentMethod === 'Pay on Visit') {
      dispatch(bookRooms({ ...booking, amountPaid: 0, paymentMethod }));
    } else {
      makePayment();
    }
  };

  return (
    <FormContainer>
      {bookingDetails && (
        <Stack spacing={2}>
          <Alert variant="filled" severity="success">
            <AlertTitle> Booking Successful</AlertTitle>
            <Button
              onClick={() => {
                navigate(`/booking/${bookingDetails._id}`);
              }}
              color="inherit"
            >
              See details
            </Button>
          </Alert>
        </Stack>
      )}
      <Form onSubmit={submitHandler}>
        <h1>Payment Method</h1>
        <Form.Group className="py-3">
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              className="py-3"
              type="radio"
              label="PayPal or Credit Card ( For International Payments ) "
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              onClick={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
            <Form.Check
              className="py-3"
              type="radio"
              label="Razorpay - Pay with UPI, debit cards, or credit cards"
              id="Razorpay"
              name="paymentMethod"
              value="Razorpay"
              checked
              onClick={(e) => {
                setPaymentMethod(e.target.value);
              }}
            ></Form.Check>
            <Form.Check
              className="py-3"
              type="radio"
              label="Pay on Visit"
              id="cod"
              name="paymentMethod"
              value="Pay on Visit"
              onClick={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="success">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};
