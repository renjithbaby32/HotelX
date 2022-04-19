import { faker } from '@faker-js/faker';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  getMonthlyStats,
  getSettlementStats,
  getWeeklyStats,
} from '../features/admin/adminSlice';
import { format, subDays, subMonths } from 'date-fns';

const months = [];

for (let i = 0; i < 12; i++) {
  const month = format(subMonths(new Date(), i), 'MM/yy/yyyy');
  months.unshift(month);
}

export const AdminDashBoardScreen = () => {
  const {
    weeklySales,
    newUsers,
    newBookings,
    newHotels,
    totalRoomsBooked,
    budgetRoomsBooked,
    premiumRoomsBooked,
    amountPaid,
    amountPending,
  } = useSelector((state) => state.admin);

  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWeeklyStats(subDays(new Date(), 7)));
    dispatch(getMonthlyStats());
    dispatch(getSettlementStats());
  }, []);

  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
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

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="New Users"
              total={newUsers ? newUsers : 0}
              color="warning"
              icon={'ant-design:user-add-outlined'}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="New Hotels"
              total={newHotels ? newHotels : 0}
              color="error"
              icon={'ant-design:bank-filled'}
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

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={[
                'English',
                'History',
                'Physics',
                'Geography',
                'Chinese',
                'Math',
              ]}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(
                () => theme.palette.text.secondary
              )}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/static/mock-images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: (
                    <Iconify
                      icon={'eva:facebook-fill'}
                      color="#1877F2"
                      width={32}
                      height={32}
                    />
                  ),
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: (
                    <Iconify
                      icon={'eva:google-fill'}
                      color="#DF3E30"
                      width={32}
                      height={32}
                    />
                  ),
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: (
                    <Iconify
                      icon={'eva:linkedin-fill'}
                      color="#006097"
                      width={32}
                      height={32}
                    />
                  ),
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: (
                    <Iconify
                      icon={'eva:twitter-fill'}
                      color="#1C9CEA"
                      width={32}
                      height={32}
                    />
                  ),
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};
