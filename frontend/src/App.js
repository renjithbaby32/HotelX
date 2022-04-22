import './App.css';
import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { UserLogin } from './screens/UserLoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserRegister from './screens/UserRegisterScreen';
import HotelOwnerLoginScreen from './screens/HotelOwnerLoginScreen';
import HotelOwnerRegisterScreen from './screens/HotelOwnerRegisterScreen';
import HotelDetailsScreen from './screens/HotelDetailsScreen';
import { HotelOwnerScreen } from './screens/HotelOwnerScreen';
import { AddHotelScreen } from './screens/AddHotelScreen';
import { NavBar } from './screens/NavBar';
import { Container, Grid } from '@mui/material';
import { BookingDetailsScreen } from './screens/BookingDetailsScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { BookingsScreen } from './screens/BookingsScreen';
import { UpcomingBookingsScreen } from './screens/UpcomingBookingsScreen';
import { DateWiseCheckIns } from './screens/DateWiseCheckIns';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { AdminDashBoardScreen } from './screens/AdminDashBoardScreen';
import DashboardLayout from './layouts/dashboard/index';
import Dash from './screens/Dash';
import ThemeProvider from './theme';
import UserDashboardScreen from './screens/UserDashboardScreen';
import HotelsDashboardScreen from './screens/HotelsDashboardScreen';
import HotelOwnersDashboardScreen from './screens/HotelOwnersDashboardScreen';
import { SalesReportScreen } from './screens/SalesReportScreen';
import Navbar2 from './layouts/dashboard/Navbar2';
const adminURIS = [
  '/admin',
  '/admin/hotels',
  '/admin/users',
  '/admin/hotel-owners',
  '/admin/sales-report',
];

function App() {
  const { pathname } = useLocation();

  return (
    <>
      {adminURIS.includes(pathname) ? (
        <ThemeProvider>
          <Routes>
            <Route path={'/admin'} element={<DashboardLayout />}>
              <Route path={'/admin'} element={<AdminDashBoardScreen />}></Route>
              <Route
                path={'/admin/hotels'}
                element={<HotelsDashboardScreen />}
              ></Route>
              <Route
                path={'/admin/users'}
                element={<UserDashboardScreen />}
              ></Route>
              <Route
                path={'/admin/hotel-owners'}
                element={<HotelOwnersDashboardScreen />}
              ></Route>
              <Route
                path={'/admin/sales-report'}
                element={<SalesReportScreen />}
              ></Route>
            </Route>
          </Routes>
        </ThemeProvider>
      ) : (
        <Grid className='App'>
          <NavBar />
          {/* <ThemeProvider>
            <Navbar2 />
          </ThemeProvider> */}
          <Container maxWidth='lg' sx={{ marginTop: '128px' }}>
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
              <Route
                path={'/hotel-owner'}
                element={<HotelOwnerScreen />}
              ></Route>
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

              <Route
                path={'/login-admin'}
                element={<AdminLoginScreen />}
              ></Route>
              <Route path={'/dash'} element={<Dash />}></Route>
            </Routes>
          </Container>
        </Grid>
      )}
    </>
  );
}

export default App;
