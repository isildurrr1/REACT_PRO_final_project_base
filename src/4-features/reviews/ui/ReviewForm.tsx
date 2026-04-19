import { useState, ChangeEvent } from 'react';
import classNames from 'classnames';
import s from './ReviewForm.module.css';
import { Rating } from 'shared/ui/Rating';
import { useAddReviewMutation } from 'shared/store/api/productsApi';
import { toast } from 'react-toastify';

type ReviewFormProps = {
	productId: string;
};

export const ReviewForm = ({ productId }: ReviewFormProps) => {
	const [reviewText, setReviewText] = useState('');
	const [rating, setRating] = useState(1);
	const [addReview, { isLoading }] = useAddReviewMutation();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!reviewText.trim()) {
			toast.warning('Напишите текст отзыва');
			return;
		}
		const response = await addReview({ productId, text: reviewText, rating });
		if (!response.error) {
			toast.success('Отзыв отправлен!');
			setReviewText('');
			setRating(0);
		} else {
			toast.error('Не удалось отправить отзыв');
		}
	};

	return (
		<form className={s['form']} onSubmit={handleSubmit}>
			<Rating isEdit rating={rating} onChange={setRating} />
			<textarea
				className={classNames(s['input'], s['textarea'])}
				name='text'
				id='text'
				placeholder='Напишите текст отзыва'
				value={reviewText}
				onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
					setReviewText(e.target.value)
				}
			/>
			<button
				type='submit'
				disabled={isLoading}
				className={classNames(s['form__btn'], s['pramary'])}>
				{isLoading ? 'Отправка...' : 'Отправить отзыв'}
			</button>
		</form>
	);
};
