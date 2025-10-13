import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { RootState, useDispatch, useSelector } from '../../services/store';
import { getAllIngredients } from '../../slices/IngredientsSlice/ingredientsSlice';
import { useParams } from 'react-router-dom';
import {
  getFeedOrdersById,
  getFeedThunk
} from '../../slices/FeedSlice/feedSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  if (!number) return null;
  const orderData = useSelector((state: RootState) =>
    getFeedOrdersById(state, Number(number))
  );
  const ingredients: TIngredient[] = useSelector(getAllIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
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
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    dispatch(getFeedThunk());
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
