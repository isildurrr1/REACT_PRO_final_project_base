import { ChangeEvent, memo } from 'react';
import classNames from 'classnames';
import s from './Card.module.css';
import { Price } from './Price/ui/Price';
import { Link } from 'react-router-dom';
import { LikeButton } from '../../LikeButton';
import { CartCounter } from '../../CartCounter';
import placeholderSrc from '../../../assets/images/placeholder.svg';

type CardProps = {
	product: Product;
	isLiked: boolean;
	onToggleLike: () => void;
	isInCart: boolean;
	cartCount: number;
	stock: number;
	onAddToCart: () => void;
	onIncrement: () => void;
	onDecrement: () => void;
	onCountChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Card = memo(function Card({
	product,
	isLiked,
	onToggleLike,
	isInCart,
	cartCount,
	stock,
	onAddToCart,
	onIncrement,
	onDecrement,
	onCountChange,
}: CardProps) {
	const { discount, price, name, tags, id, images } = product;

	return (
		<article className={s['card']}>
			<div
				className={classNames(
					s['card__sticky'],
					s['card__sticky_type_top-left']
				)}>
				{discount > 0 && <span className={s['card__discount']}>-{discount} ₽</span>}
				{tags.length > 0 &&
					tags.map((t) => (
						<span key={t} className={classNames(s['tag'], s['tag_type_new'])}>
							{t}
						</span>
					))}
			</div>
			<div
				className={classNames(
					s['card__sticky'],
					s['card__sticky_type_top-right']
				)}>
				<LikeButton isLiked={isLiked} onToggle={onToggleLike} />
			</div>
			<Link className={s['card__link']} to={`/products/${id}`}>
				<div className={s['card__image-wrap']}>
					<img
						src={images || placeholderSrc}
						alt={name}
						className={s['card__image']}
						loading='lazy'
						onError={(e) => {
							e.currentTarget.src = placeholderSrc;
						}}
					/>
					{isInCart && cartCount >= stock && (
						<div className={s['card__stock-overlay']}>
							<span className={s['card__stock-count']}>{cartCount}</span>
							<span className={s['card__stock-label']}>больше нет</span>
						</div>
					)}
				</div>
				<div className={s['card__desc']}>
					<Price price={price} discountPrice={discount} />
					<h3 className={s['card__name']}>{name}</h3>
				</div>
			</Link>
			<div className={s['card__cart']}>
				{isInCart ? (
					<CartCounter
						count={cartCount}
						stock={stock}
						onIncrement={onIncrement}
						onDecrement={onDecrement}
						onChange={onCountChange}
					/>
				) : (
					<button
						onClick={onAddToCart}
						className={classNames(
							s['card__btn'],
							s['card__btn_type_primary']
						)}>
						В корзину
					</button>
				)}
			</div>
		</article>
	);
});
