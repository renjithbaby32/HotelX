import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import {
  UserListHead,
  UserListToolbar,
  HotelMoreMenu,
} from '../sections/@dashboard/user';
import USERLIST from '../_mock/user';
import { getHotels, getUserList } from '../features/admin/adminSlice';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'cityAndState', label: 'Location', alignRight: false },
  { id: 'ownerName', label: 'Name of Hotel OWner', alignRight: false },
  { id: 'ownerEmail', label: 'E-mail of Owner', alignRight: false },
  { id: 'ownerPhone', label: 'Phone Number of Owner', alignRight: false },
  { id: 'totalRooms', label: 'Total Number of Rooms', alignRight: false },
  { id: 'budgetRooms', label: 'Number of Budget Rooms', alignRight: false },
  { id: 'premiumRooms', label: 'Number of Premium Rooms', alignRight: false },
  { id: 'stars', label: 'Star Rating', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

export default function HotelDashboardScreen() {
  const { userBlockedOrUnblocked } = useSelector((state) => state.admin);

  const { hotels, hotelBlockedOrUnblocked } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    dispatch(getHotels());
  }, [hotelBlockedOrUnblocked]);

  return (
    <Page title="UserDashboard">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Hotels
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                {hotels && (
                  <TableBody>
                    {hotels
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        const {
                          _id,
                          name,
                          city,
                          state,
                          isActive,
                          owner,
                          totalNumberOfRooms,
                          numberOfBudgetRooms,
                          numberOfPremiumRooms,
                          stars,
                        } = row;
                        const isItemSelected = selected.indexOf(name) !== -1;

                        return (
                          <TableRow
                            hover
                            key={_id}
                            tabIndex={-1}
                            role="checkbox"
                            selected={isItemSelected}
                            aria-checked={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, name)}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Avatar alt={name} src={name} />
                                <Typography variant="subtitle2" noWrap>
                                  {name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="left">{`${city}, ${state}`}</TableCell>
                            <TableCell align="left">{owner.name}</TableCell>
                            <TableCell align="left">{owner.email}</TableCell>
                            <TableCell align="left">{owner.phone}</TableCell>
                            <TableCell align="left">
                              {totalNumberOfRooms}
                            </TableCell>
                            <TableCell align="left">
                              {numberOfBudgetRooms}
                            </TableCell>
                            <TableCell align="left">
                              {numberOfPremiumRooms}
                            </TableCell>
                            <TableCell align="left">{stars}</TableCell>
                            <TableCell align="left">
                              <Label
                                variant="ghost"
                                color={
                                  (isActive === true && 'success') || 'warning'
                                }
                              >
                                {sentenceCase(
                                  isActive === true
                                    ? 'active'
                                    : 'needs approval'
                                )}
                              </Label>
                            </TableCell>

                            <TableCell align="right">
                              <HotelMoreMenu hotel={row} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
