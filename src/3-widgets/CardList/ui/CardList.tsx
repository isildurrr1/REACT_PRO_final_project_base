import { CardFeature } from 'features/products';
import s from './CardList.module.css';

type CardListProps = {
	title: string;
	products: Product[];
};
export const CardList = ({ title, products }: CardListProps) => {
	if (!products.length) {
		return <h1 className='header-title container'>Товар не найден</h1>;
	}

	return (
		<div className={`${s['card-list']} container`}>
			<div className={s['card-list__header']}>
				<h2 className={s['card-list__title']}>{title}</h2>
			</div>
			<div className={s['card-list__items']}>
				{products.map((product) => (
					<CardFeature key={product.id} product={product} />
				))}
			</div>
		</div>
	);
};
