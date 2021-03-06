import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import Iconify from '../../../components/Iconify';
import { useDispatch } from 'react-redux';
import { blockOrUnblockUser } from '../../../features/admin/adminSlice';

export default function UserMoreMenu({ user }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <div
          onClick={() => {
            dispatch(blockOrUnblockUser(user._id));
            setIsOpen(false);
          }}
        >
          {user.isBlocked ? (
            <MenuItem sx={{ color: 'text.secondary' }}>
              <ListItemIcon>
                <Iconify icon="eva:edit-fill" width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary="Unblock User"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
          ) : (
            <MenuItem
              component={RouterLink}
              to="#"
              sx={{ color: 'text.secondary' }}
            >
              <ListItemIcon>
                <Iconify icon="eva:edit-fill" width={24} height={24} />
              </ListItemIcon>
              <ListItemText
                primary="Block User"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </MenuItem>
          )}
        </div>
      </Menu>
    </>
  );
}
