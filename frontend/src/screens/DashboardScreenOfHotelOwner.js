import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import Page from '../components/Page';
import {
  AppCurrentVisits,
  AppWebsiteVisits,
  AppWidgetSummary,
} from '../sections/@dashboard/app';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getWeeklyStats } from '../features/hotelOwners/hotelOwnerSlice';
import { format, subDays, subMonths } from 'date-fns';

const months = [];

for (let i = 0; i < 12; i++) {
  const month = format(subMonths(new Date(), i), 'MM/yy/yyyy');
  months.unshift(month);
}

export const DashboardScreenOfHotelOwner = () => {
  const {
    weeklySales,
    newBookings,
    totalRoomsBooked,
    budgetRoomsBooked,
    premiumRoomsBooked,
    amountPaid,
    amountPending,
    hotelOwner,
  } = useSelector((state) => state.hotelOwner);

  console.log(hotelOwner);

  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (hotelOwner) {
      dispatch(
        getWeeklyStats({
          startDate: subDays(new Date(), 7),
          hotelOwnerId: hotelOwner._id,
        })
      );
    }

    // dispatch(getMonthlyStats());
    // dispatch(getSettlementStats());
  }, [hotelOwner]);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}></Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Weekly Sales"
              total={weeklySales ? weeklySales : 0}
              icon={'ant-design:wallet-filled'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="New Bookings"
              total={newBookings ? newBookings : 0}
              color="info"
              icon={'ant-design:schedule-filled'}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Monthly Bookings Trend"
              subheader="Last 12 months"
              chartLabels={months}
              chartData={[
                {
                  name: 'Total bookings',
                  type: 'area',
                  fill: 'gradient',
                  data: totalRoomsBooked ? totalRoomsBooked : [],
                },
                {
                  name: 'Budget rooms',
                  type: 'area',
                  fill: 'solid',
                  data: budgetRoomsBooked ? budgetRoomsBooked : [],
                },
                {
                  name: 'Premium rooms',
                  type: 'area',
                  fill: 'solid',
                  data: premiumRoomsBooked ? premiumRoomsBooked : [],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Settlement status"
              subheader="Last 30 days"
              chartData={[
                { label: 'Paid', value: amountPaid ? amountPaid : 0 },
                { label: 'Pending', value: amountPending ? amountPending : 0 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.chart.yellow[0],
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
