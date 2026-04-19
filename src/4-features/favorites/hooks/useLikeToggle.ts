import { useState, useEffect, useOptimistic, useTransition } from 'react';
import { useAppSelector } from 'shared/store/utils';
import { userSelectors } from 'shared/store/slices/user';
import {
	useSetLikeProductMutation,
	useDeleteLikeProductMutation,
	IErrorResponse,
} from 'shared/store/api/productsApi';
import { toast } from 'react-toastify';

export const useLikeToggle = (product: Product) => {
	const accessToken = useAppSelector(userSelectors.getAccessToken);
	const user = useAppSelector(userSelectors.getUser);

	const [setLike] = useSetLikeProductMutation();
	const [deleteLike] = useDeleteLikeProductMutation();

	const actualIsLiked = product.likes.some((l) => l.userId === user?.id);

	// stableIsLiked — источник истины для useOptimistic (не product.likes напрямую).
	// Обновляется внутри transition при успехе, чтобы при откате useOptimistic
	// возвращался к уже актуальному значению (без мигания).
	const [stableIsLiked, setStableIsLiked] = useState(actualIsLiked);

	// Синхронизация при внешних изменениях (рефетч, другая вкладка)
	useEffect(() => {
		setStableIsLiked(actualIsLiked);
	}, [actualIsLiked]);

	const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(stableIsLiked);
	const [isPending, startTransition] = useTransition();

	const toggleLike = () => {
		if (!accessToken) {
			toast.warning('Вы не авторизованы');
			return;
		}

		const next = !stableIsLiked;

		startTransition(async () => {
			setOptimisticIsLiked(next); // мгновенный UI

			const response = next
				? await setLike({ id: `${product.id}` })
				: await deleteLike({ id: `${product.id}` });

			if (!response.error) {
				setStableIsLiked(next); // обновляем до конца transition → нет отката
			} else {
				const error = response.error as IErrorResponse;
				toast.error(error.data?.message ?? 'Не удалось обновить');
				// stableIsLiked не меняется → useOptimistic откатывается к старому значению
			}
		});
	};

	return { isLiked: optimisticIsLiked, isPending, toggleLike };
};
