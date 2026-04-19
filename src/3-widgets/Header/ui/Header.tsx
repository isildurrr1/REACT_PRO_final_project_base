import classNames from 'classnames';
import s from './Header.module.css';
import { Logo } from 'shared/ui/Logo';
import { SearchFeature } from 'features/search';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'shared/store/utils';
import { userSelectors, userActions } from 'shared/store/slices/user';
import { isLiked } from 'shared/utils';
import { cartSelectors } from 'shared/store/slices/cart';
import { useGetProductsQuery } from 'shared/store/api/productsApi';

export const Header = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector(userSelectors.getUser);
	const cartProducts = useAppSelector(cartSelectors.getCartProducts);

	const { data: allProductsData } = useGetProductsQuery({
		searchText: '',
		sort: 'newest',
		page: 1,
	});

	const likeCount = (allProductsData?.products ?? []).filter((product) =>
		isLiked(product.likes, user?.id)
	).length;

	const accessToken = useAppSelector(userSelectors.getAccessToken);

	return (
		<header className={s.header}>
			<div className={classNames('container', s.header__wrapper)}>
				<Logo />
				<SearchFeature />
				<div className={s['header__icons-menu']}>
					<Link className={s['header__favorites-link']} to='/favorites'>
						<svg
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M12 21C12.2115 21 12.5136 20.8627 12.7351 20.7353C18.4048 17.2059 22 13.098 22 8.92157C22 5.45098 19.5529 3 16.29 3C14.427 3 12.9164 3.86275 12 5.18627C11.1037 3.87255 9.57301 3 7.70997 3C4.44713 3 2 5.45098 2 8.92157C2 13.098 5.59517 17.2059 11.2749 20.7353C11.4864 20.8627 11.7885 21 12 21ZM12 19.3431C11.9597 19.3431 11.8892 19.2941 11.7986 19.2255C7.57905 16.5 3.62135 12.5686 3.62135 8.92157C3.62135 6.31373 5.35347 4.57843 7.68983 4.57843C9.58308 4.57843 10.6707 5.72549 11.3152 6.70588C11.5871 7.09804 11.7583 7.20588 12 7.20588C12.2417 7.20588 12.3927 7.08824 12.6848 6.70588C13.3797 5.7451 14.427 4.57843 16.3102 4.57843C18.6465 4.57843 20.3787 6.31373 20.3787 8.92157C20.3787 12.5686 16.4209 16.5 12.2115 19.2255C12.1108 19.2941 12.0403 19.3431 12 19.3431Z'
								fill='#1A1A1A'></path>
						</svg>
						<span className={s['header__icon-bubble']}>{likeCount}</span>
					</Link>
					<Link className={s['header__favorites-link']} to='/cart'>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M18.12 22C19.9352 22 21 20.9824 21 18.9667V8.83953C21 6.82387 19.9251 5.80626 17.8158 5.80626H16.1932C16.1425 3.75147 14.2868 2 11.9949 2C9.7031 2 7.84732 3.75147 7.79662 5.80626H6.18423C4.06479 5.80626 3 6.81409 3 8.83953V18.9667C3 20.9922 4.06479 22 6.18423 22H18.12ZM14.5606 5.80626H9.4293C9.48 4.52446 10.5651 3.48728 11.9949 3.48728C13.4248 3.48728 14.5099 4.52446 14.5606 5.80626ZM18.0896 20.4247H6.20451C5.19042 20.4247 4.63268 19.9061 4.63268 18.8885V8.91781C4.63268 7.9002 5.19042 7.3816 6.20451 7.3816H17.7854C18.7893 7.3816 19.3673 7.9002 19.3673 8.91781V18.8885C19.3673 19.9061 18.7893 20.4247 18.0896 20.4247Z'
								fill='#1A1A1A'></path>
						</svg>
						<span className={s['header__icon-bubble']}>
							{cartProducts.length}
						</span>
					</Link>
					{accessToken && (
						<>
							<Link className={s['header__icons-menu-item']} to='/products/new'>
								+ Добавить товар
							</Link>
							<Link className={s['header__icons-menu-item']} to='/profile'>
								<svg
									viewBox='64 64 896 896'
									focusable='false'
									data-icon='user'
									width='1em'
									height='1em'
									fill='currentColor'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'>
									<path d='M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z'></path>
								</svg>
							</Link>
							<Link
								className={s['header__icons-menu-item']}
								to={'/signin'}
								onClick={() => dispatch(userActions.clearUser())}>
								Выйти
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
};
