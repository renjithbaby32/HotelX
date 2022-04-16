import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getCheckInDetailsOfTheDay,
  getCheckOutDetailsOfTheDay,
} from '../features/hotelOwners/hotelOwnerSlice';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Stack, Typography } from '@mui/material';
import { format } from 'date-fns';

const columns = [
  { id: 'customerName', label: 'Customer Name', minWidth: 170 },
  { id: 'budgetRooms', label: 'Booked budget rooms', minWidth: 100 },
  { id: 'premiumRooms', label: 'Booked premium rooms', minWidth: 100 },
  { id: 'checkInDate', label: 'Check-in date', minWidth: 100 },
  { id: 'checkOutDate', label: 'Check-out date', minWidth: 100 },
  { id: 'phone', label: 'Phone number', minWidth: 100 },
  { id: 'email', label: 'Email', minWidth: 100 },
  { id: 'amount', label: 'Amount', minWidth: 100 },
  { id: 'amountDue', label: 'Amount due', minWidth: 100 },
];

export const DateWiseCheckIns = () => {
  const dispatch = useDispatch();
  const { checkInDetails, checkOutDetails, hotelOwner } = useSelector(
    (state) => state.hotelOwner
  );
  const { hotelid, date: checkInDate } = useParams();

  useEffect(() => {
    dispatch(getCheckInDetailsOfTheDay({ hotelid, checkInDate, hotelOwner }));
    dispatch(getCheckOutDetailsOfTheDay({ hotelid, checkInDate, hotelOwner }));
  }, []);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3">
        {format(new Date(checkInDate), 'EEEE-MMM-dd-yyyy')}
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography variant="h4">Check-Ins</Typography>
        <TableContainer sx={{ maxHeight: '50vh' }}>
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
              {checkInDetails
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.customerName}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id}>
                            {column.id === 'checkInDate'
                              ? format(new Date(value), 'EEEE-MMM-dd-yyyy')
                              : column.id === 'checkOutDate'
                              ? format(new Date(value), 'EEEE-MMM-dd-yyyy')
                              : column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
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
          count={checkInDetails.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography variant="h4">Check-Outs</Typography>
        <TableContainer sx={{ maxHeight: '50vh' }}>
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
              {checkOutDetails
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.customerName}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id}>
                            {column.id === 'checkInDate'
                              ? format(new Date(value), 'EEEE-MMM-dd-yyyy')
                              : column.id === 'checkOutDate'
                              ? format(new Date(value), 'EEEE-MMM-dd-yyyy')
                              : column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
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
          count={checkOutDetails.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Stack>
  );
};
