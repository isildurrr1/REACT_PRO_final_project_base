import { ComponentType, FC } from 'react';
import { useAppSelector } from '../utils';
import { userSelectors } from '../slices/user';
import { Navigate, useLocation } from 'react-router-dom';

export const WithProtection = <P extends object>(
	WrappedComponent: ComponentType<P>
) => {
	const ReturnedComponent: FC<P> = (props) => {
		// Достаем accessToken из redux'a
		const accessToken = useAppSelector(userSelectors.getAccessToken);
		// Объект location на понадобиться для задания состояния при redirect'e
		const location = useLocation();

		const authPaths = ['/signin', '/signup'];
		// Если токен пустой, то нужно отправить пользователя на странице входа в систему
		if (!accessToken && !authPaths.includes(location.pathname)) {
			return (
				<Navigate
					to='/signin'
					// при этом мы передаем состояние, в котором указываем, какую
					// страницу хотел посетить пользователь. И если он в дальнейшем
					// войдет в систему, то мы его автоматически перебросим на желаемую страницу
					state={{
						from: location.pathname,
					}}
				/>
			);
		}

		return <WrappedComponent {...props} />;
	};

	// У каждого компонента должно быть имя. Это поможет нам, когда будем использовать
	// dev tools'ы реакта
	ReturnedComponent.displayName = `withProtection${WrappedComponent.displayName}`;

	return ReturnedComponent;
};
