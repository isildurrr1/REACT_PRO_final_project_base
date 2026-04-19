import { useLocation } from 'react-router-dom';
import { userSelectors } from '../slices/user';
import { useAppSelector } from '../utils';
import { isLiked } from '../../utils';
import { productsSelectors } from '../slices/products';
import { useGetProductsQuery } from '../api/productsApi';

export const useProducts = () => {
	const { pathname } = useLocation();

	const { searchText, page, perPage, sort } = useAppSelector(
		productsSelectors.getProductsState
	);

	const isFavoritesPage = pathname === '/favorites';
	const { isLoading, isError, error, data, isFetching } = useGetProductsQuery({
		searchText,
		sort,
		page,
		perPage: isFavoritesPage ? undefined : perPage,
	});

	let products = data?.products || [];

	const user = useAppSelector(userSelectors.getUser);

	if (isFavoritesPage) {
		products = products.filter((product) => isLiked(product.likes, user?.id));
	}

	const productsCount = data?.length || 0;

	return {
		products,
		isLoading,
		isError,
		isFetching,
		error,
		productsCount,
	};
};
