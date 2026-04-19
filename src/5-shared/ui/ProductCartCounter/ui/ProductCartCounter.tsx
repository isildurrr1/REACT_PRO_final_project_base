import s from './ProductCartCounter.module.css';
import classNames from 'classnames';
import { useCount } from '../hooks/useCount';
import { useAddToCart } from '../../../hooks/useAddToCart';
import { useDispatch } from 'react-redux';
import { cartActions } from '../../../store/slices/cart';

type ProductCartCounterProps = {
	product: Product;
	cartItem?: CartProduct;
};

export const ProductCartCounter = ({ product, cartItem }: ProductCartCounterProps) => {
	const { count, handleCount, handleCountMinus, handleCountPlus } = useCount();
	const { addProductToCart } = useAddToCart();
	const dispatch = useDispatch();

	const inCart = !!cartItem;
	const displayCount = inCart ? cartItem.count : count;

	const handleMinus = () => {
		if (inCart) {
			const next = Math.max(cartItem.count - 1, 1);
			dispatch(cartActions.setCartProductCount({ id: product.id, count: next }));
		} else {
			handleCountMinus();
		}
	};

	const handlePlus = () => {
		if (inCart) {
			const next = Math.min(cartItem.count + 1, 99);
			dispatch(cartActions.setCartProductCount({ id: product.id, count: next }));
		} else {
			handleCountPlus();
		}
	};

	const handleChange = inCart
		? (e: React.ChangeEvent<HTMLInputElement>) => {
				const val = +e.target.value;
				const valid = val > 99 ? 99 : val < 1 ? 1 : val;
				dispatch(cartActions.setCartProductCount({ id: product.id, count: valid }));
		  }
		: handleCount;

	return (
		<div className={classNames(s['product__btn-wrap'])}>
			<div className={s['button-count']}>
				<button className={s['button-count__minus']} onClick={handleMinus}>
					-
				</button>
				<input
					type='number'
					className={s['button-count__num']}
					value={displayCount}
					onChange={handleChange}
				/>
				<button
					className={s['button-count__plus']}
					onClick={handlePlus}
					disabled={inCart && cartItem.count >= product.stock}>
					+
				</button>
			</div>
			{!inCart && (
				<button
					onClick={() => addProductToCart({ ...product, count })}
					className={classNames(s['button'], s['button_type_primary'])}>
					В корзину
				</button>
			)}
			{inCart && (
				<button
					onClick={() => dispatch(cartActions.deleteCartProduct(product.id))}
					className={classNames(s['button'], s['button_type_remove'])}>
					Убрать
				</button>
			)}
		</div>
	);
};
