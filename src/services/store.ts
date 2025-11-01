import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import userSlice from '../slices/UserSlice/userSlice';
import ingredientsSlice from '../slices/IngredientsSlice/ingredientsSlice';
import feedSlice from '../slices/FeedSlice/feedSlice';

const rootReducer = combineReducers({
  user: userSlice,
  ingredients: ingredientsSlice,
  feed: feedSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
