import s from './CartPage.module.css';
import classNames from 'classnames';
import { useAppSelector } from 'shared/store/utils';
import { cartSelectors } from 'shared/store/slices/cart';
import { CartList } from './CartList';
import { CartAmount } from './CartAmount';

export const CartPage = () => {
	const products = useAppSelector(cartSelectors.getCartProducts);

	if (!products.length) {
		return <h1 className='header-title container' style={{ marginTop: 40 }}>Товаров нет в корзине</h1>;
	}

	return (
		<div className={classNames(s['content'], 'container')}>
			<div className={classNames(s['content-cart'])}>
				<div className={classNames(s['cart-title'])}>
					<span>{products.length}</span> в корзине
				</div>
				<CartList products={products} />
				<CartAmount products={products} />
			</div>
		</div>
	);
};
