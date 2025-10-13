import { TIngredient } from '@utils-types';

export type BurgerConstructorElementUIProps = {
  ingredient: TIngredient;
  index: number;
  totalItems: number;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleClose: () => void;
};
