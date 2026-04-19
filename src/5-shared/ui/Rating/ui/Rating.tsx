import { memo } from 'react';
import { ReactComponent as Star } from '../../../assets/icons/star.svg';

type TRating = {
	rating?: number;
	isEdit?: boolean;
	onChange?: (rating: number) => void;
};
export const Rating = memo(function Rating({ rating = 0, isEdit = false, onChange }: TRating) {
	return (
		<div>
			{[...Array(5)].map((_e, i) => (
				<span key={i} style={{ cursor: isEdit ? 'pointer' : 'default' }}>
					<Star
						onClick={() => onChange?.(i + 1)}
						fill={i < rating ? 'gold' : 'gray'}
					/>
				</span>
			))}
		</div>
	);
});
