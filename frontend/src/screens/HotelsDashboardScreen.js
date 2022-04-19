import { useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import Page from '../components/Page';
import {
  ProductSort,
  HotelList,
  ProductCartWidget,
  ProductFilterSidebar,
} from '../sections/@dashboard/hotels';
import PRODUCTS from '../_mock/products';
import { getHotels } from '../features/admin/adminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function HotelsDashboardScreen() {
  const [openFilter, setOpenFilter] = useState(false);

  const { hotels } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  useEffect(() => {
    dispatch(getHotels());
  }, []);

  return (
    <Page title="Dashboard: Hotels">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hotels
        </Typography>

        <Stack
          direction="row"
          flexWrap="wrap-reverse"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 5 }}
        >
          <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
            {/* <ProductFilterSidebar
              isOpenFilter={openFilter}
              onOpenFilter={handleOpenFilter}
              onCloseFilter={handleCloseFilter}
            /> */}
            {/* <ProductSort /> */}
          </Stack>
        </Stack>

        {hotels && <HotelList hotels={hotels} />}
      </Container>
    </Page>
  );
}
