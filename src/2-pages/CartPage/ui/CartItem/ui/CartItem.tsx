import { memo } from 'react';
import { ReactComponent as TrashIcon } from 'shared/assets/icons/trash.svg';
import { Link } from 'react-router-dom';
import s from '../../CartPage.module.css';
import classNames from 'classnames';
import { CartCounterFeature } from 'features/cart';
import placeholderSrc from 'shared/assets/images/placeholder.svg';

type CartItemProps = {
	product: CartProduct;
	onDelete: (id: string) => void;
};
export const CartItem = memo(function CartItem({ product, onDelete }: CartItemProps) {
	const { id, name, images, price, discount, count } = product;

	return (
		<div className={classNames(s['cart-item'])}>
			<div className={classNames(s['cart-item__desc'])}>
				<img
					src={images || placeholderSrc}
					alt={name}
					className={classNames(s['cart-item__image'])}
					onError={(e) => { e.currentTarget.src = placeholderSrc; }}
				/>

				<div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 16 }}>
					<Link
						className={classNames(s['cart-item__title'])}
						style={{ flexGrow: 1 }}
						to={`/products/${id}`}>
						<h2 style={{ margin: 0, fontSize: 16 }}>{name}</h2>
					</Link>

					<CartCounterFeature productId={id} />

					<div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3, minWidth: 90, textAlign: 'right' }}>
						<span style={{ fontSize: 12, textDecoration: 'line-through', color: '#7b8e98' }}>
							{`${price * count} ₽`}
						</span>
						<span style={{ fontSize: 18, fontWeight: 800, color: '#f44336' }}>
							{`${(price - discount) * count} ₽`}
						</span>
					</div>

					<button
						style={{ marginLeft: 40 }}
						className={classNames(s['cart-item__bnt-trash'])}
						onClick={() => onDelete(id)}>
						<TrashIcon />
					</button>
				</div>
			</div>
		</div>
	);
});
