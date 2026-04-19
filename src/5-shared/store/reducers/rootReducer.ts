import { combineReducers } from 'redux';
import { userSlice } from '../slices/user';
import { cartSlice } from '../slices/cart';
import { productsSlice } from '../slices/products';
import { authApi } from '../api/authApi';
import { productsApi } from '../api/productsApi';

export const rootReducer = combineReducers({
	[userSlice.name]: userSlice.reducer,
	[cartSlice.name]: cartSlice.reducer,
	[productsSlice.name]: productsSlice.reducer,
	[authApi.reducerPath]: authApi.reducer,
	[productsApi.reducerPath]: productsApi.reducer,
});
