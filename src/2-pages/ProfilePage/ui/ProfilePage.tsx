import s from './ProfilePage.module.css';
import classNames from 'classnames';
import { ButtonBack } from 'shared/ui/ButtonBack';
import { WithProtection } from 'shared/store/HOCs/WithProtection';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'shared/store/utils';
import { userSelectors, userActions } from 'shared/store/slices/user';
import { useChangeUserMutation } from 'shared/store/api/authApi';
import { toast } from 'react-toastify';

type ProfileFormValues = {
	name: string;
	about: string;
	avatarPath: string;
	email: string;
};

type PasswordFormValues = {
	password: string;
};

export const ProfilePage = WithProtection(() => {
	const dispatch = useAppDispatch();
	const user = useAppSelector(userSelectors.getUser);
	const [changeUser, { isLoading: isSavingProfile }] = useChangeUserMutation();
	const [changePassword, { isLoading: isSavingPassword }] = useChangeUserMutation();

	const { register: registerProfile, handleSubmit: handleSubmitProfile } =
		useForm<ProfileFormValues>({
			defaultValues: {
				name: user?.name ?? '',
				about: user?.about ?? '',
				avatarPath: user?.avatarPath ?? '',
				email: user?.email ?? '',
			},
		});

	const { register: registerPassword, handleSubmit: handleSubmitPassword, reset } =
		useForm<PasswordFormValues>();

	const onSaveProfile = async (values: ProfileFormValues) => {
		const response = await changeUser(values);
		if (!response.error) {
			dispatch(userActions.setUser({ ...user, ...values }));
			toast.info('Профиль сохранён');
		} else {
			toast.error('Не удалось сохранить профиль');
		}
	};

	const onSavePassword = async (values: PasswordFormValues) => {
		const response = await changePassword(values);
		if (!response.error) {
			toast.info('Пароль изменён');
			reset();
		} else {
			toast.error('Не удалось изменить пароль');
		}
	};

	return (
		<div className='container'>
			<ButtonBack />
			<h1 className={s['form__title']}>Мои данные</h1>
			<form className={s['form']} onSubmit={handleSubmitProfile(onSaveProfile)}>
				<div className={s['form__row']}>
					<label className={s['form__label']}>
						<input
							className={s['input']}
							type='text'
							placeholder='Введите ваше имя'
							{...registerProfile('name')}
						/>
					</label>
					<label className={s['form__label']}>
						<input
							className={s['input']}
							type='text'
							placeholder='Описание профессии'
							{...registerProfile('about')}
						/>
					</label>
				</div>
				<div className={s['form__row']}>
					<label className={s['form__label']}>
						<input
							className={s['input']}
							type='url'
							placeholder='Введите ссылку на аватарку'
							{...registerProfile('avatarPath')}
						/>
					</label>
					<label className={s['form__label']}>
						<input
							className={s['input']}
							type='text'
							placeholder='Email'
							{...registerProfile('email')}
						/>
					</label>
				</div>
				<button
					type='submit'
					disabled={isSavingProfile}
					className={classNames(s['form__btn'], s['secondary'], s['maxContent'])}>
					{isSavingProfile ? 'Сохранение...' : 'Сохранить'}
				</button>
			</form>

			<h2 className={s['form__title']}>Изменить пароль</h2>
			<form className={s['form']} onSubmit={handleSubmitPassword(onSavePassword)}>
				<div className={classNames(s['form__row'], s['form__row_min'])}>
					<label className={s['form__label']}>
						<input
							className={s['input']}
							type='password'
							placeholder='Пароль'
							{...registerPassword('password')}
						/>
					</label>
				</div>
				<button
					type='submit'
					disabled={isSavingPassword}
					className={classNames(s['form__btn'], s['secondary'], s['maxContent'])}>
					{isSavingPassword ? 'Сохранение...' : 'Сохранить'}
				</button>
			</form>
		</div>
	);
});
