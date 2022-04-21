import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser as setUserAction } from '../features/users/usersSlice';
import { setHotelOwner as setHotelOwnerAction } from '../features/hotelOwners/hotelOwnerSlice';
import { setAdmin as setAdminAction } from '../features/admin/adminSlice';

export const useIdentity = (identity) => {
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [hotelOwner, setHotelOwner] = useState(
    localStorage.getItem('hotelOwner')
  );
  const [admin, setAdmin] = useState(localStorage.getItem('admin'));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (identity === 'user') {
      if (!user) {
        navigate('/login');
      } else {
        dispatch(setUserAction());
      }
    } else if (identity === 'hotelOwner') {
      if (!hotelOwner) {
        navigate('/hotel-owner-login');
      } else {
        dispatch(setHotelOwnerAction());
      }
    } else if (identity === 'admin') {
      if (!admin) {
        navigate('/admin-login');
      } else {
        dispatch(setAdminAction());
      }
    }
  }, []);

  return {
    user: user ? JSON.parse(user) : null,
    hotelOwner: hotelOwner ? JSON.parse(hotelOwner) : null,
    admin: admin ? JSON.parse(admin) : null,
  };
};
