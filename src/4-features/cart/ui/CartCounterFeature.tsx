import { CartCounter } from 'shared/ui/CartCounter';
import { useCartCounter } from '../hooks/useCartCounter';

type TCartCounterFeatureProps = {
	productId: string;
};

export const CartCounterFeature = ({ productId }: TCartCounterFeatureProps) => {
	const { count, stock, handleIncrement, handleDecrement, handleSetCount } =
		useCartCounter(productId);

	return (
		<CartCounter
			count={count}
			stock={stock}
			onIncrement={handleIncrement}
			onDecrement={handleDecrement}
			onChange={handleSetCount}
		/>
	);
};
