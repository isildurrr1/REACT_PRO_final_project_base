import { FC, useEffect, useRef } from 'react';
import {
	Avatar,
	Box,
	Container,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'react-toastify';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { SignInFormValues } from '../utils/types';
import { signInFormSchema } from '../utils/validators';
import { useSignInMutation } from 'shared/store/api/authApi';
import { userActions } from 'shared/store/slices/user';
import { getMessageFromError } from 'shared/utils';

export const SignInForm: FC = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const [signInRequestFn] = useSignInMutation();
	// useRef — автофокус на поле email при открытии страницы
	const emailInputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		emailInputRef.current?.focus();
	}, []);
	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting, isSubmitted },
	} = useForm<SignInFormValues>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: yupResolver(signInFormSchema),
	});

	const submitHandler: SubmitHandler<SignInFormValues> = async (values) => {
		try {
			const response = await signInRequestFn(values).unwrap();

			dispatch(userActions.setUser(response.user));
			dispatch(
				userActions.setAccessToken({ accessToken: response.accessToken })
			);

			toast.success('Вы успешно авторизованы!');

			if (location.state?.from) {
				return navigate(location.state.from);
			}

			navigate('/');
		} catch (error) {
			toast.error(
				getMessageFromError(
					error,
					'Неизвестная ошибка при авторизации пользователя'
				)
			);
		}
	};

	return (
		<Container component='main' maxWidth='xs'>
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Вход
				</Typography>
				<Box
					component='form'
					onSubmit={handleSubmit(submitHandler)}
					noValidate
					sx={{ my: 1 }}>
					<Controller
						name='email'
						control={control}
						render={({ field }) => (
							<TextField
								margin='normal'
								label='Электронная почта'
								type='email'
								fullWidth
								required
								autoComplete='email'
								error={!!errors.email?.message}
								helperText={errors.email?.message}
								inputRef={emailInputRef}
								{...field}
							/>
						)}
					/>
					<Controller
						name='password'
						control={control}
						render={({ field }) => (
							<TextField
								label='Пароль'
								type='password'
								error={!!errors.password?.message}
								helperText={errors.password?.message}
								margin='normal'
								fullWidth
								required
								{...field}
							/>
						)}
					/>

					<LoadingButton
						type='submit'
						disabled={isSubmitted && (!isValid || isSubmitting)}
						loading={isSubmitting}
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}>
						Войти
					</LoadingButton>
					<Box display='flex' justifyContent='center' flexGrow={1}>
						<Link component={RouterLink} to='/signup'>
							Зарегистрироваться
						</Link>
					</Box>
				</Box>
			</Box>
		</Container>
	);
};
