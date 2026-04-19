import { ChangeEvent, memo, useCallback } from 'react';
import { Card } from 'shared/ui/Card';
import { useAppSelector, useAppDispatch } from 'shared/store/utils';
import { cartSelectors, cartActions } from 'shared/store/slices/cart';
import { userSelectors } from 'shared/store/slices/user';
import { useLikeToggle } from '../../favorites/hooks/useLikeToggle';

type CardFeatureProps = {
	product: Product;
};

export const CardFeature = memo(function CardFeature({ product }: CardFeatureProps) {
	const dispatch = useAppDispatch();
	const cartItem = useAppSelector(
		(state) => cartSelectors.getCartProducts(state).find((p) => p.id === product.id)
	);
	const user = useAppSelector(userSelectors.getUser);
	const isInCart = !!cartItem;
	const cartCount = cartItem?.count ?? 1;
	const stock = product.stock ?? 99;

	const { isLiked, toggleLike } = useLikeToggle(product);

	const handleAddToCart = useCallback(() => {
		dispatch(cartActions.addCartProduct({ ...product, count: 1 }));
	}, [dispatch, product]);

	const handleIncrement = useCallback(() => {
		if (!cartItem) return;
		const next = Math.min(cartCount + 1, 99);
		dispatch(cartActions.setCartProductCount({ id: product.id, count: next }));
	}, [dispatch, product.id, cartCount, cartItem]);

	const handleDecrement = useCallback(() => {
		if (!cartItem) return;
		if (cartCount <= 1) {
			dispatch(cartActions.deleteCartProduct(product.id));
		} else {
			dispatch(cartActions.setCartProductCount({ id: product.id, count: cartCount - 1 }));
		}
	}, [dispatch, product.id, cartCount, cartItem]);

	const handleCountChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const val = +e.target.value;
			const valid = val > 99 ? 99 : val < 1 ? 1 : val;
			dispatch(cartActions.setCartProductCount({ id: product.id, count: valid }));
		},
		[dispatch, product.id]
	);

	return (
		<Card
			product={product}
			isLiked={isLiked}
			onToggleLike={toggleLike}
			isInCart={isInCart}
			cartCount={cartCount}
			stock={stock}
			onAddToCart={handleAddToCart}
			onIncrement={handleIncrement}
			onDecrement={handleDecrement}
			onCountChange={handleCountChange}
		/>
	);
});
