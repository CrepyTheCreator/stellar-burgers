import { ConstructorState, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: ConstructorState;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
