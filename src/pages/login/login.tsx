import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import {
  getLoginUserRequest,
  loginUser
} from '../../slices/UserSlice/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isLoading = useSelector(getLoginUserRequest);
  const from = location.state?.from;
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate(from?.pathname || '/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) return <Preloader />;

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
