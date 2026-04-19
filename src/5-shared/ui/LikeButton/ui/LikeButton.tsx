import { memo } from 'react';
import s from './LikeButton.module.css';
import { ReactComponent as LikeSvg } from './../../../assets/icons/like.svg';
import classNames from 'classnames';

type TLikeButtonProps = {
	isLiked: boolean;
	onToggle: () => void;
	disabled?: boolean;
};

export const LikeButton = memo(function LikeButton({ isLiked, onToggle, disabled }: TLikeButtonProps) {
	return (
		<button
			className={classNames(s['card__favorite'], {
				[s['card__favorite_is-active']]: isLiked,
			})}
			onClick={onToggle}
			disabled={disabled}>
			<LikeSvg />
		</button>
	);
});
