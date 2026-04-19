import { FC } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
	Avatar,
	Box,
	Container,
	Link,
	TextField,
	Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';

import { SignUpFormValues } from '../utils/types';
import { signUpFormSchema } from '../utils/validators';
import { userActions } from 'shared/store/slices/user';
import { getMessageFromError } from 'shared/utils';
import { useSignUpMutation } from 'shared/store/api/authApi';

export const SignUpForm: FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [signUpRequestFn] = useSignUpMutation();
	const {
		control,
		handleSubmit,
		formState: { errors, isValid, isSubmitting, isSubmitted },
	} = useForm<SignUpFormValues>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: yupResolver(signUpFormSchema),
	});

	const submitHandler: SubmitHandler<SignUpFormValues> = async (values) => {
		try {
			const response = await signUpRequestFn(values).unwrap();

			dispatch(userActions.setUser(response.user));
			dispatch(
				userActions.setAccessToken({ accessToken: response.accessToken })
			);

			toast.success('Вы успешно зарегистрированы!');
			navigate('/');
		} catch (error) {
			toast.error(
				getMessageFromError(
					error,
					'Неизвестная ошибка при регистрации пользователя'
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
					Регистрация
				</Typography>
				<Box
					component='form'
					onSubmit={handleSubmit(submitHandler)}
					noValidate
					sx={{ mt: 1 }}>
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
						Зарегистрироваться
					</LoadingButton>
					<Box display='flex' justifyContent='center' flexGrow={1}>
						<Link component={RouterLink} to='/signin'>
							Войти
						</Link>
					</Box>
				</Box>
			</Box>
		</Container>
	);
};
