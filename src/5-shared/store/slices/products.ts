import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ProductsState = {
	sort: Sort;
	page: number;
	perPage: number;
	searchText: string;
};

const initialState: ProductsState = {
	searchText: '',
	sort: 'newest',
	page: 1,
	perPage: 6,
};

export const productsSlice = createSlice({
	name: 'products',
	initialState: initialState,
	reducers: {
		setSort: (state, action: PayloadAction<Sort>) => ({
			...state,
			sort: action.payload,
		}),
		setSearchText: (state, action: PayloadAction<string>) => ({
			...state,
			searchText: action.payload,
		}),
		setPage: (state, action: PayloadAction<number>) => ({
			...state,
			page: action.payload,
		}),
	},

	selectors: {
		getSort: (state: ProductsState) => state.sort,
		getSearchText: (state: ProductsState) => state.searchText,
		getPage: (state: ProductsState) => state.page,
		getPerPage: (state: ProductsState) => state.perPage,
		getProductsState: (state: ProductsState) => state,
	},
});

export const productsActions = { ...productsSlice.actions };
export const productsSelectors = productsSlice.selectors;
