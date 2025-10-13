import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getIngredientById } from '../../slices/IngredientsSlice/ingredientsSlice';
import { RootState } from 'src/services/store';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  if (!id) return <Navigate to={'*'} />;
  const ingredientData = useSelector((state: RootState) =>
    getIngredientById(state, id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
