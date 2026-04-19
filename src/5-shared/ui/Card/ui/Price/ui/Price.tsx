import classNames from 'classnames';
import s from './Price.module.css';

type TPriceProps = {
	price: number;
	discountPrice: number;
};

export const Price = ({ price, discountPrice }: TPriceProps) => {
	const hasDiscount = discountPrice > 0;

	return (
		<div className={classNames(s['price-small'], s['price-wrap'])}>
			{hasDiscount && (
				<span className={classNames(s['price_old'], s['price_left'])}>
					{`${price}₽`}
				</span>
			)}
			<span className={classNames(s['price'], { [s['price_discount']]: hasDiscount })}>
				{`${hasDiscount ? price - discountPrice : price}₽`}
			</span>
		</div>
	);
};
