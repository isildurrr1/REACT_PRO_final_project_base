import * as yup from 'yup';

export const signInFormSchema = yup.object({
	email: yup
		.string()
		.email('Введите корректный email')
		.required('Email обязателен'),
	password: yup
		.string()
		.min(6, 'Минимум 6 символов')
		.max(24, 'Максимум 24 символа')
		.required('Пароль обязателен'),
});

export const signUpFormSchema = yup.object({
	email: yup
		.string()
		.email('Введите корректный email')
		.required('Email обязателен'),
	password: yup
		.string()
		.min(6, 'Минимум 6 символов')
		.max(24, 'Максимум 24 символа')
		.required('Пароль обязателен'),
});
