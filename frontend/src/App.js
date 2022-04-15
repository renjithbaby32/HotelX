import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLogin from './screens/UserLoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserRegister from './screens/UserRegisterScreen';
import HotelOwnerLoginScreen from './screens/HotelOwnerLoginScreen';
import HotelOwnerRegisterScreen from './screens/HotelOwnerRegisterScreen';
import HotelDetailsScreen from './screens/HotelDetailsScreen';
import { HotelOwnerScreen } from './screens/HotelOwnerScreen';
import { AddHotelScreen } from './screens/AddHotelScreen';
import { NavBar } from './screens/NavBar';
import { Container } from '@mui/material';
import { BookingDetailsScreen } from './screens/BookingDetailsScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { BookingsScreen } from './screens/BookingsScreen';
import { UpcomingBookingsScreen } from './screens/UpcomingBookingsScreen';
import { DateWiseCheckIns } from './screens/DateWiseCheckIns';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar></NavBar>
        <Container maxWidth="lg">
          <Routes>
            <Route path={'/'} element={<HomeScreen />}></Route>
            <Route path={'/login'} element={<UserLogin />}></Route>
            <Route
              path={'/hotel/:hotelid'}
              element={<HotelDetailsScreen />}
            ></Route>
            <Route path={'/register'} element={<UserRegister />}></Route>
            <Route
              path={'/hotel-owner-login'}
              element={<HotelOwnerLoginScreen />}
            ></Route>
            <Route path={'/hotel-owner'} element={<HotelOwnerScreen />}></Route>
            <Route
              path={'/hotel-owner/upcoming/:hotelid'}
              element={<UpcomingBookingsScreen />}
            ></Route>
            <Route
              path={'/hotel-owner/upcoming/:hotelid/:date'}
              element={<DateWiseCheckIns />}
            ></Route>
            <Route
              path={'/hotel-owner-register'}
              element={<HotelOwnerRegisterScreen />}
            ></Route>
            <Route path={'/hotel/add'} element={<AddHotelScreen />}></Route>
            <Route
              path={'/booking/:bookingid'}
              element={<BookingDetailsScreen />}
            ></Route>
            <Route
              path={'/bookings/:userid'}
              element={<BookingsScreen />}
            ></Route>
            <Route path={'/payment'} element={<PaymentScreen />}></Route>
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
