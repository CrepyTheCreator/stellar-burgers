import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getAllIngredients } from '../../slices/IngredientsSlice/ingredientsSlice';
import { useParams } from 'react-router-dom';
import {
  getModalLoading,
  getModalOrder,
  getOrderByNumber
} from '../../slices/FeedSlice/feedSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const ingredients: TIngredient[] = useSelector(getAllIngredients);
  const orderData = useSelector(getModalOrder);
  const loading = useSelector(getModalLoading);
  useEffect(() => {
    dispatch(getOrderByNumber(Number(number)));
  }, [dispatch, number]);
  const orderInfo = useMemo(() => {
    const order = orderData && orderData.length > 0 ? orderData[0] : null;

    if (!order || loading || !order.ingredients) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading) return <Preloader />;
  if (!number) return null;
  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
