import React from 'react';

import { GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshToken';
import { useDispatch } from 'react-redux';
import {
  userLoginWithGoogle,
  userRegisterWithGoogle,
} from '../features/users/usersSlice';

const clientId =
  '734684227813-r4sspaq2g6mjmh3if4g52q7hv6e2rkdo.apps.googleusercontent.com';

export const Login = ({ action }) => {
  const dispatch = useDispatch();

  const onSuccess = (res) => {
    if (action === 'login') {
      dispatch(userLoginWithGoogle(res.googleId));
    } else {
      dispatch(userRegisterWithGoogle(res.tokenId));
    }
    refreshTokenSetup(res);
  };

  const onFailure = (res) => {};

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText={
          action === 'login' ? 'Login with Google' : 'Register with Google'
        }
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        // isSignedIn={true}
      />
    </div>
  );
};
