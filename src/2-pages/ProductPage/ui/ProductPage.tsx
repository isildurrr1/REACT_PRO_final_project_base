import s from './ProductPage.module.css';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import truckSVG from 'shared/assets/icons/truck.svg';
import qualitySVG from 'shared/assets/icons/quality.svg';
import { Rating } from 'shared/ui/Rating';
import { ButtonBack } from 'shared/ui/ButtonBack';
import { ReviewList } from 'features/reviews';
import { WithProtection } from 'shared/store/HOCs/WithProtection';
import { useGetProductQuery } from 'shared/store/api/productsApi';
import { ProductCartCounter } from 'shared/ui/ProductCartCounter/ui/ProductCartCounter';
import { useAppSelector } from 'shared/store/utils';
import { cartSelectors } from 'shared/store/slices/cart';
import { LikeButtonFeature } from 'features/favorites';
import { Modal } from 'shared/ui/Modal';
import { useRef, useState } from 'react';
import { useDeleteProductMutation } from 'shared/store/api/productsApi';
import { userSelectors } from 'shared/store/slices/user';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import placeholderSrc from 'shared/assets/images/placeholder.svg';

export const ProductPage = WithProtection(() => {
	const location = useLocation();
	const { pathname } = location;
	const productId = pathname.split('/').at(-1) || '';

	const cartItem = useAppSelector(
		(state) => cartSelectors.getCartProducts(state).find((p) => p.id === productId)
	);

	const { data: product } = useGetProductQuery({ id: productId });

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [hasRealImage, setHasRealImage] = useState(true);
	const imgButtonRef = useRef<HTMLButtonElement>(null);
	const navigate = useNavigate();
	const user = useAppSelector(userSelectors.getUser);
	const [deleteProduct] = useDeleteProductMutation();

	if (!product) {
		return <></>;
	}

	const { id, name, images, description, price, discount, slug, stock, category, reviews } = product;
	const isOwner = product.user?.id === user?.id;
	const avgRating = reviews.length
		? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
		: 0;

	const handleDeleteProduct = async () => {
		const response = await deleteProduct({ id });
		if (!response.error) {
			toast.info('Товар удалён');
			navigate('/');
		} else {
			toast.error('Не удалось удалить товар');
		}
	};

	return (
		<div className='container'>
			<ButtonBack />
			<h1 className={classNames(s['header-title'])}>{name}</h1>
			<p className='acticul'>
				Артикул: <b>{slug}</b>
			</p>
			<Rating rating={avgRating} />
			<div className={classNames(s['product'])}>
				<div className={classNames(s['product__img-wrapper'])}>
					{hasRealImage && images ? (
						<button
							ref={imgButtonRef}
							onClick={() => setIsModalOpen(true)}
							style={{ background: 'none', border: 'none', padding: 0, display: 'block', width: '100%', cursor: 'zoom-in' }}>
							<img
								src={images}
								alt={description}
								className={classNames(s['product__img'])}
								onError={(e) => {
									e.currentTarget.src = placeholderSrc;
									setHasRealImage(false);
								}}
							/>
						</button>
					) : (
						<img
							src={placeholderSrc}
							alt={description}
							className={classNames(s['product__img'])}
						/>
					)}
					<Modal
						isOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						triggerRef={imgButtonRef}>
						<img
							src={images}
							alt={description}
							style={{ maxWidth: '80vw', maxHeight: '80vh', display: 'block' }}
						/>
					</Modal>
				</div>
				<div className={classNames(s['product__desc'])}>
					<div className={classNames(s['price-big'], s['price-wrap'])}>
						{discount > 0 && (
							<span className={classNames(s['price_old'], s['price_left'])}>
								{`${price} ₽`}
							</span>
						)}
						<span className={classNames(s['price'], { [s['price_discount']]: discount > 0 })}>
							{`${discount > 0 ? price - discount : price} ₽`}
						</span>
					</div>

					<ProductCartCounter product={product} cartItem={cartItem} />

					<LikeButtonFeature product={product} />
					{isOwner && (
						<button
							onClick={handleDeleteProduct}
							style={{
								padding: '8px 20px',
								background: '#f44336',
								color: '#fff',
								border: 'none',
								borderRadius: 8,
								cursor: 'pointer',
								fontWeight: 700,
							}}>
							Удалить товар
						</button>
					)}
					<div className={classNames(s['product__delivery'])}>
						<img src={truckSVG} alt='truck' />
						<div className={classNames(s['product__right'])}>
							<h3 className={classNames(s['product__name'])}>
								Доставка по всему Миру!
							</h3>
							<p className={classNames(s['product__text'])}>
								Доставка курьером — <span className='bold'> от 399 ₽</span>
							</p>
							<p className={classNames(s['product__text'])}>
								Доставка в пункт выдачи —
								<span className={classNames(s['product__bold'])}>
									{' '}
									от 199 ₽
								</span>
							</p>
						</div>
					</div>
					<div className={classNames(s['product__delivery'])}>
						<img src={qualitySVG} alt='quality' />
						<div className={classNames(s['product__right'])}>
							<h3 className={classNames(s['product__name'])}>
								Гарантия качества
							</h3>
							<p className={classNames(s['product__text'])}>
								Если Вам не понравилось качество нашей продукции, мы вернем
								деньги, либо сделаем все возможное, чтобы удовлетворить ваши
								нужды.
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className={classNames(s['product__box'])}>
				{description && (
					<>
						<h2 className={classNames(s['product__title'])}>Описание</h2>
						<p className={classNames(s['product__subtitle'])}>{description}</p>
					</>
				)}
				<h2 className={classNames(s['product__title'])}>Характеристики</h2>
				<div className={classNames(s['product__grid'])}>
					{category && (
						<>
							<div className={classNames(s['product__naming'])}>Категория</div>
							<div className={classNames(s['product__description'])}>{category.name}</div>
						</>
					)}
					<div className={classNames(s['product__naming'])}>Цена</div>
					<div className={classNames(s['product__description'])}>
						{discount > 0 ? `${price - discount} ₽ (скидка ${discount} ₽)` : `${price} ₽`}
					</div>
					<div className={classNames(s['product__naming'])}>Остаток</div>
					<div className={classNames(s['product__description'])}>{stock} шт.</div>
					<div className={classNames(s['product__naming'])}>Отзывы</div>
					<div className={classNames(s['product__description'])}>{reviews.length} шт.</div>
				</div>
			</div>
			<ReviewList product={product} />
		</div>
	);
});
