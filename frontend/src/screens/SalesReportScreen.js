import React, { forwardRef, useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@mui/icons-material';
import { getSalesReport } from '../features/admin/adminSlice';
import { differenceInDays, subMonths } from 'date-fns';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import { Button, Grid, TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const columns = [
  { title: 'Hotel ID', field: 'id' },
  { title: 'Name', field: 'name' },
  {
    title: 'Number of rooms booked',
    field: 'totalNumberOfRooms',
    type: 'numeric',
  },
  {
    title: 'Total amount',
    field: 'totalAmount',
    type: 'currency',
    currencySetting: {
      locale: 'en',
      currencyCode: 'inr',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  {
    title: 'Amount paid',
    field: 'paidAmount',
    type: 'currency',
    currencySetting: {
      locale: 'en',
      currencyCode: 'inr',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
  {
    title: 'Pending amount',
    field: 'pendingAmount',
    type: 'currency',
    currencySetting: {
      locale: 'en',
      currencyCode: 'inr',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    },
  },
];

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

export const SalesReportScreen = () => {
  const [startDate, setStartDate] = useState(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [dateError, setDateError] = useState(false);

  const { salesReport } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchSalesReport = () => {
    dispatch(getSalesReport({ startDate, endDate }));
  };

  useEffect(() => {
    fetchSalesReport();
  }, []);

  return (
    <div>
      <Grid sx={{ margin: '32px' }} container spacing={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <DatePicker
              label="From"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <DatePicker
              label="To"
              value={endDate}
              onChange={(newValue) => {
                if (differenceInDays(newValue, startDate) < 1) {
                  setDateError(true);
                } else {
                  setEndDate(newValue);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Button
              onClick={() => {
                if (!dateError) {
                  fetchSalesReport();
                }
              }}
              style={{ marginTop: '8px' }}
              size="large"
              variant="contained"
            >
              Find Hotels
            </Button>
          </Grid>
        </LocalizationProvider>
      </Grid>
      {salesReport && (
        <MaterialTable
          icons={tableIcons}
          data={salesReport.map((o) => ({ ...o }))}
          columns={columns}
          title={'Sales Report'}
          options={{
            filtering: true,
            pageSize: 10,
            pageSizeOptions: [10, 20, 30, 40, 50],
            exportButton: true,
            exportAllData: true,
          }}
        />
      )}
    </div>
  );
};
