import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserOrders,
  getUserOrdersThunk
} from '../../slices/UserSlice/userSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserOrdersThunk());
  }, [dispatch]);
  const orders: TOrder[] = useSelector(getUserOrders);

  return <ProfileOrdersUI orders={orders} />;
};
