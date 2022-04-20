import { useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Divider,
  Typography,
  Stack,
  MenuItem,
  Avatar,
  IconButton,
} from '@mui/material';
import MenuPopover from '../../components/MenuPopover';
import account from '../../_mock/account';
import { useIdentity } from '../../utils/identity';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../features/users/usersSlice';

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:home-fill',
    linkTo: '/',
  },
  {
    label: 'Bookings',
    icon: 'eva:person-fill',
    linkTo: '/bookings/:userid',
  },
];

export default function AccountPopover() {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);
  const { user } = useIdentity();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        {user && (
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {user.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {user.email}
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {user && (
          <Stack sx={{ p: 1 }}>
            {MENU_OPTIONS.map((option) => (
              <MenuItem
                key={option.label}
                to={option.linkTo}
                component={RouterLink}
                onClick={handleClose}
              >
                {option.label}
              </MenuItem>
            ))}
          </Stack>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {user ? (
          <MenuItem
            onClick={() => {
              handleClose();
              dispatch(clearUser());
              localStorage.removeItem('user');
              navigate('/login');
            }}
            sx={{ m: 1 }}
          >
            Logout
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              handleClose();
              navigate('/login');
            }}
            sx={{ m: 1 }}
          >
            Login
          </MenuItem>
        )}
      </MenuPopover>
    </>
  );
}
