import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { UserLogin } from './screens/UserLoginScreen';
import HomeScreen from './screens/HomeScreen';
import UserRegister from './screens/UserRegisterScreen';
import HotelOwnerLoginScreen from './screens/HotelOwnerLoginScreen';
import HotelOwnerRegisterScreen from './screens/HotelOwnerRegisterScreen';
import HotelDetailsScreen from './screens/HotelDetailsScreen';
import { HotelOwnerScreen } from './screens/HotelOwnerScreen';
import { AddHotelScreen } from './screens/AddHotelScreen';
import { Container } from '@mui/material';
import { BookingDetailsScreen } from './screens/BookingDetailsScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { BookingsScreen } from './screens/BookingsScreen';
import { UpcomingBookingsScreen } from './screens/UpcomingBookingsScreen';
import { DateWiseCheckIns } from './screens/DateWiseCheckIns';
import { AdminLoginScreen } from './screens/AdminLoginScreen';
import { AdminDashBoardScreen } from './screens/AdminDashBoardScreen';
import DashboardLayout from './layouts/dashboard/index';
import ThemeProvider from './theme';
import UserDashboardScreen from './screens/UserDashboardScreen';
import HotelsDashboardScreen from './screens/HotelsDashboardScreen';
import HotelOwnersDashboardScreen from './screens/HotelOwnersDashboardScreen';
import { SalesReportScreen } from './screens/SalesReportScreen';
import { DashboardScreenOfHotelOwner } from './screens/DashboardScreenOfHotelOwner';
import { AddPromotionScreen } from './screens/AddPromotionScreen';

function App() {
  const { pathname } = useLocation();

  return (
    <>
      {pathname.includes('/admin') ? (
        <ThemeProvider>
          <Routes>
            <Route path={'/admin'} element={<DashboardLayout role={'admin'} />}>
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
      ) : pathname.includes('/hotel-owner') ? (
        <ThemeProvider>
          <Container maxWidth={'xl'}>
            <Routes>
              <Route
                path={'/hotel-owner'}
                element={<DashboardLayout role={'hotelOwner'} />}
              >
                <Route
                  path={'/hotel-owner'}
                  element={<DashboardScreenOfHotelOwner />}
                ></Route>
                <Route
                  path={'/hotel-owner/hotels'}
                  element={<HotelOwnerScreen />}
                ></Route>
                <Route
                  path={'/hotel-owner/upcoming/:hotelid'}
                  element={<UpcomingBookingsScreen />}
                ></Route>
                <Route
                  path={'upcoming/:hotelid/:date'}
                  element={<DateWiseCheckIns />}
                ></Route>
                <Route path={'add'} element={<AddHotelScreen />}></Route>
                <Route
                  path={'add-promotion'}
                  element={<AddPromotionScreen />}
                ></Route>
              </Route>
            </Routes>
          </Container>
        </ThemeProvider>
      ) : (
        <ThemeProvider>
          <Container maxWidth={'xl'}>
            <Routes>
              <Route path={'/'} element={<DashboardLayout role={'user'} />}>
                <Route path={'/'} element={<HomeScreen />}></Route>
                <Route path={'/login'} element={<UserLogin />}></Route>
                <Route
                  path={'/hotel/:hotelid'}
                  element={<HotelDetailsScreen />}
                ></Route>
                <Route path={'/register'} element={<UserRegister />}></Route>
                <Route
                  path={'/login-hotel-owner'}
                  element={<HotelOwnerLoginScreen />}
                ></Route>
                <Route
                  path={'/hotel-owner-register'}
                  element={<HotelOwnerRegisterScreen />}
                ></Route>
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
              </Route>
            </Routes>
          </Container>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
