import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

interface FeedState {
  allItems: TOrdersData;
  isLoading: boolean;
  error: string | null;
  modalOrder: TOrder[] | null;
  modalLoading: boolean;
}

const initialState: FeedState = {
  allItems: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  modalOrder: null,
  modalLoading: false,
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

export const getOrderByNumber = createAsyncThunk(
  'orders/fetchByMuber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders;
  }
);

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
      state.allItems.orders.find((el) => el.number === number),
    getModalOrder: (state) => state.modalOrder,
    getModalLoading: (state) => state.modalLoading
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
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.modalLoading = true;
        state.modalOrder = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.modalOrder = action.payload;
        state.modalLoading = false;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.modalLoading = false;
      });
  }
});

export const { setOrders } = feedSlice.actions;
export const {
  getFeedOrders,
  getFeedLoading,
  getFeedAll,
  getFeedOrdersById,
  getModalLoading,
  getModalOrder
} = feedSlice.selectors;
export default feedSlice.reducer;
