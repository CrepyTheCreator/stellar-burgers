import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  getIngredientsThunk,
  createOrderThunk
} from './ingredientsSlice';
import { TIngredient, ConstructorState } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun1',
  name: 'Булка 1',
  type: 'bun',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: ''
};
const main: TIngredient = {
  _id: 'main1',
  name: 'Мясо',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 100,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('ingredientsSlice', () => {
  it('addIngredient добавляет булку', () => {
    const state = reducer(undefined, addIngredient(bun));
    expect(state.constructor.bun).toEqual(bun);
  });

  it('addIngredient добавляет начинку', () => {
    const state = reducer(undefined, addIngredient(main));
    expect(state.constructor.ingredients).toContain(main);
  });

  it('removeIngredient удаляет ингредиент по индексу', () => {
    const initialState = { ...reducer(undefined, addIngredient(main)) };
    const state = reducer(initialState, removeIngredient(0));
    expect(state.constructor.ingredients).toHaveLength(0);
  });

  it('moveIngredient меняет порядок ингредиентов', () => {
    const initialState = {
      constructor: { bun: null, ingredients: [main, main] },
      items: { buns: [], mains: [], sauces: [] },
      allItems: [],
      isLoading: false,
      error: null
    };
    const state = reducer(
      initialState as any,
      moveIngredient({ index: 0, direction: 'down' })
    );
    expect(state.constructor.ingredients[1]).toEqual(main);
  });

  it('getIngredientsThunk pending устанавливает isLoading=true', () => {
    const state = reducer(
      undefined,
      getIngredientsThunk.pending('', undefined)
    );
    expect(state.isLoading).toBe(true);
  });

  it('getIngredientsThunk fulfilled записывает ингредиенты и isLoading=false', () => {
    const state = reducer(
      undefined,
      getIngredientsThunk.fulfilled([bun, main], '', undefined)
    );
    expect(state.allItems).toEqual([bun, main]);
    expect(state.items.buns).toEqual([bun]);
    expect(state.items.mains).toEqual([main]);
    expect(state.isLoading).toBe(false);
  });

  it('getIngredientsThunk rejected записывает ошибку и isLoading=false', () => {
    const state = reducer(
      undefined,
      getIngredientsThunk.rejected(null, '', undefined, 'Ошибка')
    );
    expect(state.error).toBe('Ошибка');
    expect(state.isLoading).toBe(false);
  });

  it('createOrderThunk pending устанавливает isLoading=true', () => {
    const constructor: ConstructorState = { bun, ingredients: [main] };
    const state = reducer(undefined, createOrderThunk.pending('', constructor));
    expect(state.isLoading).toBe(true);
  });

  it('createOrderThunk fulfilled сбрасывает конструктор', () => {
    const constructor: ConstructorState = { bun, ingredients: [main] };
    const state = reducer(
      undefined,
      createOrderThunk.fulfilled(
        { success: true, order: {}, name: 'Заказ' },
        '',
        constructor
      )
    );
    expect(state.constructor.bun).toBeNull();
    expect(state.constructor.ingredients).toHaveLength(0);
    expect(state.isLoading).toBe(false);
  });

  it('createOrderThunk rejected записывает ошибку', () => {
    const constructor: ConstructorState = { bun: null, ingredients: [main] };
    const state = reducer(
      undefined,
      createOrderThunk.rejected(null, '', constructor, 'Булка не выбрана')
    );
    expect(state.error).toBe('Булка не выбрана');
    expect(state.isLoading).toBe(false);
  });
});
