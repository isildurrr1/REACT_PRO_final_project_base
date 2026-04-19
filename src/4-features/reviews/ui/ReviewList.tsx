import classNames from 'classnames';
import s from './ReviewList.module.css';
import { Rating } from 'shared/ui/Rating';
import { ReviewForm } from './ReviewForm';

type ReviewListProps = {
	product: Product;
};

export const ReviewList = ({ product }: ReviewListProps) => {
	return (
		<div className={classNames(s['product__reviews'])}>
			{product.reviews.map((review) => (
				<div className={s['review']} key={review.id}>
					<div className={s['review__header']}>
						<div className={s['review__name']}>{review.user.name}</div>
						<div className={s['review__date']}>
							{new Date(review.createdAt).toLocaleDateString('ru-RU')}
						</div>
					</div>
					<Rating rating={review.rating} />
					<p className={s['review__text']}>{review.text}</p>
				</div>
			))}

			<h2>Отзыв о товаре {product.name}</h2>
			<ReviewForm productId={product.id} />
		</div>
	);
};
