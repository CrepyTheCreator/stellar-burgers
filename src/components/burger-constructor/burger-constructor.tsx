import { FC, useMemo, useState } from 'react';
import { TIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { getConstructor } from '../../slices/IngredientsSlice/ingredientsSlice';
import { createOrderThunk } from '../../slices/IngredientsSlice/ingredientsSlice';
import { getIsAuthenticated } from '../../slices/UserSlice/userSlice';
import { useLocation, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const userIsAuth = useSelector(getIsAuthenticated);
  const constructorItems = useSelector(getConstructor);
  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);
  const navigate = useNavigate();

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients?.reduce(
        (sum: number, item: TIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = async () => {
    console.log(userIsAuth);
    if (!userIsAuth)
      return navigate('/login', { replace: true, state: { from: location } });
    if (!constructorItems.bun || orderRequest) return;
    try {
      setOrderRequest(true);
      const resultAction = await dispatch(createOrderThunk(constructorItems));
      if (createOrderThunk.fulfilled.match(resultAction)) {
        setOrderModalData(resultAction.payload.order);
      } else {
        console.error('Ошибка при создании заказа:', resultAction.payload);
      }
    } finally {
      setOrderRequest(false);
    }
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
