import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { getUpComingBookings } from '../features/hotelOwners/hotelOwnerSlice';
import { addDays, format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { getHotel } from '../features/hotel/hotelSlice';
import { Button } from 'react-bootstrap';
import { useIdentity } from '../utils/identity';

const columns = [
  { id: 'date', label: 'date', minWidth: 170 },
  { id: 'budgetRooms', label: 'Booked budget rooms', minWidth: 100 },
  { id: 'premiumRooms', label: 'Booked premium rooms', minWidth: 100 },
];

export const UpcomingBookingsScreen = () => {
  const { hotelid } = useParams();
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(addDays(new Date(), 14));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { upcomingBookings } = useSelector((state) => state.hotelOwner);
  const { hotel } = useSelector((state) => state.hotel);
  const { hotelOwner } = useIdentity('hotelOwner');

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    console.log(hotelOwner);
    dispatch(getHotel(hotelid));

    dispatch(
      getUpComingBookings({
        startDate,
        endDate,
        hotelId: hotelid,
        hotelOwner,
      })
    );
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '80vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingBookings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.date}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          onClick={() => {
                            navigate(
                              `/hotel-owner/upcoming/${hotelid}/${value}`
                            );
                          }}
                        >
                          {column.id === 'date' ? (
                            <Button className={'btn-block btn-info'}>
                              {format(new Date(value), 'EEEE-MMM-dd-yyyy')}
                            </Button>
                          ) : column.format && typeof value === 'number' ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={upcomingBookings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
