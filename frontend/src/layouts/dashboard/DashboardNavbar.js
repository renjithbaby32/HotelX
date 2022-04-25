import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material';
import Iconify from '../../components/Iconify';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import { Link } from 'react-router-dom';

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

export default function DashboardNavbar({ onOpenSidebar, role }) {
  return (
    <RootStyle>
      <ToolbarStyle>
        <IconButton
          onClick={onOpenSidebar}
          sx={{ mr: 1, color: 'text.primary', display: { lg: 'none' } }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        <Link to={'/'}>
          <Typography variant={'h4'}>HotelX</Typography>
        </Link>

        {/* <Searchbar /> */}
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
        >
          {/* <LanguagePopover /> */}
          {role === 'admin' && <NotificationsPopover />}

          <AccountPopover role={role} />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
