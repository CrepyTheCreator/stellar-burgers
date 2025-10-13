import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Preloader } from '../components/ui/preloader/preloader';
import { FC } from 'react';
import { getUser, getLoginUserRequest } from '../slices/UserSlice/userSlice';

export const ProtectedRoute: FC<{ onlyUnAuth?: boolean }> = ({
  onlyUnAuth = false
}) => {
  const Loading = useSelector(getLoginUserRequest);
  const user = useSelector(getUser);
  const location = useLocation();

  if (Loading) {
    return <Preloader />;
  }

  if (onlyUnAuth && user.email !== '') {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && user.email == '') {
    return <Navigate to='/login' state={{ from: location }} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
