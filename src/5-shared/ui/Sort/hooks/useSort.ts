import { useAppDispatch, useAppSelector } from '../../../store/utils';
import {
	productsActions,
	productsSelectors,
} from '../../../store/slices/products';

interface SortParams {
	title: string;
	value: Sort;
	href: string;
}
export const useSort = () => {
	const dispatch = useAppDispatch();

	const sort = useAppSelector(productsSelectors.getSort);

	const setSort = (newSort: Sort) => {
		dispatch(productsActions.setSort(newSort));
	};

	const sortParams: SortParams[] = [
		{
			title: 'Дешевые',
			value: 'low-price',
			href: '#',
		},
		{
			title: 'Дорогие',
			value: 'high-price',
			href: '#',
		},
		{
			title: 'Новые',
			value: 'newest',
			href: '#',
		},
		{
			title: 'Старые',
			value: 'oldest',
			href: '#',
		},
	];
	return { sort, setSort, sortParams };
};
