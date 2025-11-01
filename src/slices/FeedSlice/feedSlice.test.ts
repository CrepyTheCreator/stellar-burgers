import reducer, { getFeedThunk, getOrderByNumber } from './feedSlice';
import { TOrdersData, TOrder } from '@utils-types';

const order: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Заказ 1',
  createdAt: '',
  updatedAt: '',
  number: 1,
  ingredients: []
};
const ordersData: TOrdersData = { orders: [order], total: 1, totalToday: 1 };

describe('feedSlice', () => {
  it('getFeedThunk pending устанавливает isLoading=true', () => {
    const state = reducer(undefined, getFeedThunk.pending('', undefined));
    expect(state.isLoading).toBe(true);
  });

  it('getFeedThunk fulfilled записывает заказы', () => {
    const state = reducer(
      undefined,
      getFeedThunk.fulfilled(ordersData, '', undefined)
    );
    expect(state.allItems).toEqual(ordersData);
    expect(state.isLoading).toBe(false);
  });

  it('getFeedThunk rejected записывает ошибку', () => {
    const state = reducer(
      undefined,
      getFeedThunk.rejected(null, '', undefined, 'Ошибка')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке заказов');
  });

  it('getOrderByNumber pending устанавливает modalLoading=true', () => {
    const state = reducer(undefined, getOrderByNumber.pending('', 1));
    expect(state.modalLoading).toBe(true);
    expect(state.modalOrder).toBeNull();
  });

  it('getOrderByNumber fulfilled записывает заказ в модалку', () => {
    const state = reducer(
      undefined,
      getOrderByNumber.fulfilled([order], '', 1)
    );
    expect(state.modalOrder).toEqual([order]);
    expect(state.modalLoading).toBe(false);
  });

  it('getOrderByNumber rejected устанавливает modalLoading=false', () => {
    const state = reducer(undefined, getOrderByNumber.rejected(null, '', 1));
    expect(state.modalLoading).toBe(false);
  });
});
