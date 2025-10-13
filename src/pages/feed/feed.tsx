import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useSelector } from '../../services/store';
import { getFeedThunk, getFeedOrders } from '../../slices/FeedSlice/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
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
