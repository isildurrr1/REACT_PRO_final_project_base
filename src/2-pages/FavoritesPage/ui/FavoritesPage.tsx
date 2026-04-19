import { WithProtection } from 'shared/store/HOCs/WithProtection';
import { WithQuery } from 'shared/store/HOCs/WithQuery';
import { useProducts } from 'shared/store/hooks/useProducts';
import { ButtonBack } from 'shared/ui/ButtonBack';
import { CardList } from 'widgets/CardList';

const CardListWithQuery = WithQuery(CardList);

export const FavoritesPage = WithProtection(() => {
	const { isLoading, isError, products, error } = useProducts();

	return (
		<>
			<div className='container'>
				<br />
				<ButtonBack />
			</div>
			<CardListWithQuery
				title='Избранные'
				isLoading={isLoading}
				isError={isError}
				products={products}
				error={error}
			/>
		</>
	);
});
