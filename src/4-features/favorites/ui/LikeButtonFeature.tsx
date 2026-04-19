import { LikeButton } from 'shared/ui/LikeButton';
import { useLikeToggle } from '../hooks/useLikeToggle';

type TLikeButtonFeatureProps = {
	product: Product;
};

export const LikeButtonFeature = ({ product }: TLikeButtonFeatureProps) => {
	const { isLiked, isPending, toggleLike } = useLikeToggle(product);

	return <LikeButton isLiked={isLiked} onToggle={toggleLike} disabled={isPending} />;
};
