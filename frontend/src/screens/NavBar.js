import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../features/users/usersSlice';
import { clearHotelOwner } from '../features/hotelOwners/hotelOwnerSlice';

export const NavBar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { hotelOwner } = useSelector((state) => state.hotelOwner);

  return (
    <header>
      <Navbar
        variant="dark"
        style={{ backgroundColor: '#000000' }}
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>HotelX</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* <Nav className="first-nav">
              <LinkContainer
                className="px-3"
                style={{ color: 'white' }}
                to={`/category/smartphone`}
              >
                <Nav.Link>Smartphones</Nav.Link>
              </LinkContainer>
              <LinkContainer
                className="px-3"
                style={{ color: 'white' }}
                to={`/category/laptop`}
              >
                <Nav.Link>Laptops</Nav.Link>
              </LinkContainer>
              <LinkContainer
                className="px-3"
                style={{ color: 'white' }}
                to="/category/others"
              >
                <Nav.Link>Everything else</Nav.Link>
              </LinkContainer>
            </Nav> */}
            <Nav className="ml-auto">
              {/* <SearchBox /> */}

              {user ? (
                <NavDropdown
                  className="px-3"
                  title={<span style={{ color: 'white' }}>{user.name}</span>}
                  id="username"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to={`/bookings/${user._id}`}>
                    <NavDropdown.Item>Bookings</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavDropdown.Item
                      onClick={() => {
                        dispatch(clearUser());
                        localStorage.removeItem('user');
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : hotelOwner ? (
                <NavDropdown
                  className="px-3"
                  title={
                    <span style={{ color: 'white' }}>{hotelOwner.name}</span>
                  }
                  id="username"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavDropdown.Item
                      onClick={() => {
                        dispatch(clearHotelOwner());
                        localStorage.removeItem('hotelOwner');
                      }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : (
                <LinkContainer style={{ color: 'white' }} to="/login">
                  <Nav.Link>
                    <PersonIcon size={'small'}></PersonIcon> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {/* {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={
                    <span style={{ color: 'white', paddingLeft: '1rem' }}>
                      Admin
                    </span>
                  }
                  id="adminmenu"
                >
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>Dashboard</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/offers">
                    <NavDropdown.Item>Offers and Coupons</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/categories">
                    <NavDropdown.Item>Categories</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderreport">
                    <NavDropdown.Item>Order Report</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/salesreport">
                    <NavDropdown.Item>Sales Report</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )} */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
