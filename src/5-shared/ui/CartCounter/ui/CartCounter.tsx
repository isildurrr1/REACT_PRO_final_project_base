import { ChangeEvent, memo } from 'react';
import s from './CartCounter.module.css';
import classNames from 'classnames';

type TCartCounter = {
	count: number;
	stock: number;
	onIncrement: () => void;
	onDecrement: () => void;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const CartCounter = memo(function CartCounter({
	count,
	stock,
	onIncrement,
	onDecrement,
	onChange,
}: TCartCounter) {
	return (
		<div className={classNames(s['button-count'])}>
			<button
				onClick={onDecrement}
				className={classNames(s['button-count__minus'])}>
				-
			</button>
			<input
				onChange={onChange}
				type='number'
				className={classNames(s['button-count__num'])}
				value={count}
			/>
			<button
				onClick={onIncrement}
				className={classNames(s['button-count__plus'])}
				disabled={count >= stock}>
				+
			</button>
		</div>
	);
});
