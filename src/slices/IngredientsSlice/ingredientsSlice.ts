import { getIngredientsApi, orderBurgerApi, TNewOrderResponse } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConstructorState, TIngredient } from '@utils-types';

interface IngredientsState {
  items: {
    buns: TIngredient[] | [];
    mains: TIngredient[] | [];
    sauces: TIngredient[] | [];
  };
  allItems: TIngredient[] | [];
  constructor: ConstructorState;
  isLoading: boolean;
  error: string | null;
}
const initialState: IngredientsState = {
  items: {
    buns: [],
    mains: [],
    sauces: []
  },
  allItems: [],
  constructor: {
    bun: null,
    ingredients: []
  },
  isLoading: true,
  error: null
};

export const getIngredientsThunk = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Неизвестная ошибка');
  }
});

export const createOrderThunk = createAsyncThunk(
  'ingredients/createOrder',
  async (constructor: ConstructorState, thunkAPI) => {
    try {
      if (!constructor.bun) {
        return thunkAPI.rejectWithValue('Булка не выбрана');
      }
      const ingredientIds = [
        constructor.bun._id,
        ...constructor.ingredients.map((item) => item._id),
        constructor.bun._id
      ];
      const data = await orderBurgerApi(ingredientIds);
      if (!data?.success) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const item = action.payload;
      if (item.type === 'bun') {
        state.constructor.bun = item;
      } else {
        state.constructor.ingredients.push(item);
      }
    },
    removeIngredient: (state, action: PayloadAction<Number>) => {
      state.constructor.ingredients = state.constructor.ingredients.filter(
        (el, i) => i !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const ingredients = state.constructor.ingredients;

      if (direction === 'up' && index > 0) {
        const temp = ingredients[index - 1];
        ingredients[index - 1] = ingredients[index];
        ingredients[index] = temp;
      }

      if (direction === 'down' && index < ingredients.length - 1) {
        const temp = ingredients[index + 1];
        ingredients[index + 1] = ingredients[index];
        ingredients[index] = temp;
      }
    }
  },
  selectors: {
    getIngredients: (state) => state.items,
    getAllIngredients: (state) => state.allItems,
    getConstructor: (state) => state.constructor,
    getIngredientLoading: (state) => state.isLoading,
    getIngredientById: (state, id: string) =>
      state.allItems.find((item) => item._id === id)
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allItems = action.payload;
        state.items.buns = action.payload.filter((item) => item.type === 'bun');
        state.items.mains = action.payload.filter(
          (item) => item.type === 'main'
        );
        state.items.sauces = action.payload.filter(
          (item) => item.type === 'sauce'
        );
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка при загрузке ингредиентов';
      })
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.constructor = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (typeof action.payload === 'string'
            ? action.payload
            : 'Ошибка при создании заказа') || 'Ошибка при создании заказа';
      });
  }
});

export const { addIngredient, removeIngredient, moveIngredient } =
  ingredientsSlice.actions;
export const {
  getIngredients,
  getIngredientLoading,
  getIngredientById,
  getConstructor,
  getAllIngredients
} = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
