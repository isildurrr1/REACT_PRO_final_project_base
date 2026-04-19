import { ChangeEvent } from 'react';
import { cartActions, cartSelectors } from '../../../store/slices/cart';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../store/utils';

const MIN_COUNT = 1;
const MAX_COUNT = 99;

export const useCount = (productId: string) => {
	const dispatch = useDispatch();
	const products = useAppSelector(cartSelectors.getCartProducts);
	const product = products.find((p) => p.id === productId) as CartProduct;

	const { id, count, stock } = product;
	const handleIncrement = () => {
		const newCount = count + 1;
		const validCount = newCount > MAX_COUNT ? MAX_COUNT : newCount;
		dispatch(cartActions.setCartProductCount({ id, count: validCount }));
	};
	const handleDecrement = () => {
		const newCount = count - 1;
		const validCount = newCount < MIN_COUNT ? MIN_COUNT : newCount;
		dispatch(cartActions.setCartProductCount({ id, count: validCount }));
	};
	const handleSetCount = (e: ChangeEvent<HTMLInputElement>) => {
		const newCount = +e.target.value;
		const validCount =
			newCount > MAX_COUNT
				? MAX_COUNT
				: newCount < MIN_COUNT
				? MIN_COUNT
				: newCount;
		dispatch(cartActions.setCartProductCount({ id, count: validCount }));
	};
	return { count, stock, handleSetCount, handleIncrement, handleDecrement };
};
