import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { AppDispatch, useDispatch, useSelector } from '../../services/store';
import { getFeedThunk, getFeedOrders } from '../../slices/FeedSlice/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeedThunk());
  }, [dispatch]);
  const orders = useSelector(getFeedOrders);

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedThunk());
      }}
    />
  );
};
