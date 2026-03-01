import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/IngredientsSlice/ingredientsSlice';
import feedReducer from '../slices/FeedSlice/feedSlice';
import userReducer from '../slices/UserSlice/userSlice';

describe('rootReducer', () => {
  it('должен комбинировать все редьюсеры', () => {
    const rootReducer = combineReducers({
      ingredients: ingredientsReducer,
      feed: feedReducer,
      user: userReducer
    });

    const state = rootReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
  });
});
