import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

interface FeedState {
  allItems: TOrdersData;
  isLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  allItems: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isLoading: true,
  error: null
};

export const getFeedThunk = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const data = await getFeedsApi();
    return data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Неизвестная ошибка');
  }
});

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<TOrdersData[]>) => {}
  },
  selectors: {
    getFeedOrders: (state) => state.allItems.orders,
    getFeedAll: (state) => state.allItems,
    getFeedLoading: (state) => state.isLoading,
    getFeedOrdersById: (state, number: number) =>
      state.allItems.orders.find((el) => el.number === number)
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedThunk.fulfilled, (state, action) => {
        state.allItems = action.payload;
        state.isLoading = false;
      })
      .addCase(getFeedThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Ошибка при загрузке заказов';
      });
  }
});

export const { setOrders } = feedSlice.actions;
export const { getFeedOrders, getFeedLoading, getFeedAll, getFeedOrdersById } =
  feedSlice.selectors;
export default feedSlice.reducer;
