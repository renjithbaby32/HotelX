import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser as setUserAction } from '../features/users/usersSlice';
import { setHotelOwner as setHotelOwnerAction } from '../features/hotelOwners/hotelOwnerSlice';
import { setAdmin as setAdminAction } from '../features/admin/adminSlice';

export const useIdentity = (identity) => {
  const [user] = useState(localStorage.getItem('user'));
  const [hotelOwner] = useState(localStorage.getItem('hotelOwner'));
  const [admin] = useState(localStorage.getItem('admin'));
  const navigate = useNavigate();

  useEffect(() => {
    if (identity === 'user') {
      if (!user) {
        navigate('/login');
      }
    } else if (identity === 'hotelOwner') {
      if (!hotelOwner) {
        navigate('/login-hotel-owner');
      }
    } else if (identity === 'admin') {
      if (!admin) {
        navigate('/login-admin');
      }
    }
  }, []);

  return null;
};
