import { useMemo } from 'react';
import s from '../../CartPage.module.css';
import classNames from 'classnames';
import { toast } from 'react-toastify';

type CartAmountProps = {
	products: CartProduct[];
};
export const CartAmount = ({ products }: CartAmountProps) => {
	// useMemo — пересчёт суммы только при изменении состава/количества корзины
	const { allPrice, allDiscount } = useMemo(
		() => ({
			allPrice: products.reduce((acc, p) => p.price * p.count + acc, 0),
			allDiscount: products.reduce((acc, p) => p.discount * p.count + acc, 0),
		}),
		[products]
	);

	const handleSubmitCart = () => {
		const order = products.map((p) => ({ id: p.id, count: p.count }));
		console.log('Отправка заказа на сервер: ', JSON.stringify(order, null, 2));
		toast.success('Заказ оформлен! Спасибо за покупку.');
	};

	return (
		<div className={classNames(s['cart-amount'])}>
			<h1 className={classNames(s['cart-amount__title'])}>Ваша корзина</h1>
			<div className={classNames(s['cart-amount__table'])}>
				<div className={classNames(s['cart-amount__table-row'])}>
					<span className={classNames(s['cart-amount__table-title'])}>
						{`Товары (${products.length})`}
					</span>
					<span className={classNames(s['cart-amount__table-value'])}>
						{`${allPrice} ₽`}
					</span>
				</div>
				<div className={classNames(s['cart-amount__table-row'])}>
					<span className={classNames(s['cart-amount__table-title'])}>
						Скидка
					</span>
					<span
						className={classNames(
							s['cart-amount__table-value'],
							s['cart-amount__table-value-discount']
						)}>
						{`${allDiscount} ₽`}
					</span>
				</div>
			</div>
			<div className={classNames(s['cart-amount__total-cost'])}>
				<h2 className={classNames(s['cart-amount__total-cost-title'])}>
					Общая стоимость
				</h2>
				<span className={classNames(s['cart-amount__total-cost-value'])}>
					{`${allPrice - allDiscount} ₽`}
				</span>
			</div>
			<button
				onClick={handleSubmitCart}
				className={classNames(
					s['button'],
					s['button_type_primary'],
					s['button_type_wide']
				)}>
				Оформить заказ
			</button>
		</div>
	);
};
