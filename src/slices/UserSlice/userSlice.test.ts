import reducer, {
  loginUser,
  registerUser,
  checkUserAuth,
  getUserOrdersThunk,
  updateUserData,
  logout
} from './userSlice';
import { TOrder } from '@utils-types';

const userData = { name: 'Test', email: 'test@mail.com' };
const orders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Заказ 1',
    createdAt: '',
    updatedAt: '',
    number: 1,
    ingredients: []
  }
];

describe('userSlice', () => {
  it('loginUser pending устанавливает loginUserRequest=true', () => {
    const state = reducer(
      undefined,
      loginUser.pending('', { email: '', password: '' })
    );
    expect(state.loginUserRequest).toBe(true);
    expect(state.loginUserError).toBeNull();
  });

  it('loginUser fulfilled записывает данные пользователя', () => {
    const state = reducer(
      undefined,
      loginUser.fulfilled(userData, '', { email: '', password: '' })
    );
    expect(state.data).toEqual(userData);
    expect(state.isAuthenticated).toBe(true);
  });

  it('loginUser rejected устанавливает loginUserRequest=false', () => {
    const state = reducer(
      undefined,
      loginUser.rejected(null, '', { email: '', password: '' })
    );
    expect(state.loginUserRequest).toBe(false);
    expect(state.isAuthChecked).toBe(true);
  });

  it('registerUser fulfilled записывает данные пользователя', () => {
    const state = reducer(
      undefined,
      registerUser.fulfilled(userData, '', {
        email: '',
        password: '',
        name: 'Test'
      })
    );
    expect(state.data).toEqual(userData);
    expect(state.isAuthenticated).toBe(true);
  });

  it('checkUserAuth fulfilled устанавливает isAuthenticated=true', () => {
    const state = reducer(undefined, checkUserAuth.fulfilled(userData));
    expect(state.data).toEqual(userData);
    expect(state.isAuthenticated).toBe(true);
  });

  it('getUserOrdersThunk fulfilled записывает заказы пользователя', () => {
    const state = reducer(
      undefined,
      getUserOrdersThunk.fulfilled(orders, '', undefined)
    );
    expect(state.userOrders).toEqual(orders);
    expect(state.orderLoading).toBe(false);
  });

  it('logout очищает данные пользователя', () => {
    const initialState = {
      ...reducer(
        undefined,
        loginUser.fulfilled(userData, '', { email: '', password: '' })
      )
    };
    const state = reducer(initialState, logout());
    expect(state.data).toEqual({ email: '', name: '' });
    expect(state.isAuthenticated).toBe(false);
  });
});
