import { useCallback } from 'react';
import { CartItem } from '../../CartItem';
import s from '../../CartPage.module.css';
import classNames from 'classnames';
import { useAppDispatch } from 'shared/store/utils';
import { cartActions } from 'shared/store/slices/cart';

type CartListProps = {
	products: CartProduct[];
};
export const CartList = ({ products }: CartListProps) => {
	const dispatch = useAppDispatch();

	const handleDelete = useCallback(
		(id: string) => dispatch(cartActions.deleteCartProduct(id)),
		[dispatch]
	);

	return (
		<div className={classNames(s['cart-list'])}>
			{products.map((p) => (
				<CartItem product={p} key={p.id} onDelete={handleDelete} />
			))}
		</div>
	);
};
