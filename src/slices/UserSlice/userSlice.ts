import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  refreshToken,
  registerUserApi,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TErorr, TOrder, TUserState } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: {
    name: '',
    email: ''
  },
  userOrders: [],
  orderLoading: false,
  loginUserError: null,
  loginUserRequest: true
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>, thunkAPI) => {
    const data = await loginUserApi({ email, password });
    if (!data?.success) {
      return thunkAPI.rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const getUserOrdersThunk = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('user/getOrders', async (_, thunkAPI) => {
  try {
    const data = await getOrdersApi();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return thunkAPI.rejectWithValue(error.message || 'Неизвестная ошибка');
    }
    return thunkAPI.rejectWithValue('Неизвестная ошибка');
  }
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, name, password }: TRegisterData, thunkAPI) => {
    const data = await registerUserApi({ email, name, password });
    if (!data?.success) {
      return thunkAPI.rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async ({ email, name, password }: TRegisterData, thunkAPI) => {
    const data = await updateUserApi({ email, name, password });
    if (!data?.success) {
      return thunkAPI.rejectWithValue(data);
    }
    return data.user;
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { rejectWithValue }) => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      return rejectWithValue('No token');
    }

    try {
      const data = await getUserApi();
      return data.user;
    } catch (err) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(err);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = { email: '', name: '' };
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      state.isAuthenticated = false;
      state.isAuthChecked = false;
    }
  },
  selectors: {
    getUser: (state) => state.data,
    getName: (state) => state.data,
    getAuthChecked: (state) => state.isAuthChecked,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getLoginUserRequest: (state) => state.loginUserRequest,
    getUserOrders: (state) => state.userOrders,
    getUserOrdersLoading: (state) => state.orderLoading
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
        state.loginUserRequest = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.orderLoading = true;
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.userOrders = action.payload;
      })
      .addCase(updateUserData.pending, (state) => {
        state.loginUserRequest = true;
        state.loginUserError = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loginUserRequest = false;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loginUserRequest = false;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      });
  }
});

export const { logout } = userSlice.actions;
export const {
  getUser,
  getName,
  getAuthChecked,
  getIsAuthenticated,
  getLoginUserRequest,
  getUserOrders,
  getUserOrdersLoading
} = userSlice.selectors;
export default userSlice.reducer;
