import { useAppDispatch, useAppSelector } from 'shared/store/utils';
import {
	productsActions,
	productsSelectors,
} from 'shared/store/slices/products';

const SORT_OPTIONS = [
	{ title: 'Дешевые', value: 'low-price' as Sort },
	{ title: 'Дорогие', value: 'high-price' as Sort },
	{ title: 'Новые', value: 'newest' as Sort },
	{ title: 'Старые', value: 'oldest' as Sort },
];

export const useSort = () => {
	const dispatch = useAppDispatch();
	const sort = useAppSelector(productsSelectors.getSort);

	const setSort = (newSort: Sort) => {
		dispatch(productsActions.setSort(newSort));
	};

	return { sort, setSort, sortOptions: SORT_OPTIONS };
};
