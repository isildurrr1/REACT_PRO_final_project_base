import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './config';
import { SignUpFormValues } from 'widgets/SignUpForm/utils/types';

type SignUpResponse = {
	user: Pick<User, 'id' | 'email'>;
	accessToken: Token['accessToken'];
};

type SignInResponse = {
	user: Pick<User, 'id' | 'email'>;
	accessToken: Token['accessToken'];
};

type UpdateUserPayload = Partial<Pick<User, 'name' | 'about' | 'avatarPath' | 'email' | 'phone'>> & { password?: string };

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: customBaseQuery,
	endpoints: (builder) => ({
		signUp: builder.mutation<SignUpResponse, SignUpFormValues>({
			query: (signUpFormValues) => ({
				url: '/auth/register',
				method: 'POST',
				body: signUpFormValues,
			}),
		}),
		signIn: builder.mutation<SignInResponse, SignUpFormValues>({
			query: (signInFormValues) => ({
				url: '/auth/login',
				method: 'POST',
				body: signInFormValues,
			}),
		}),
		changeUser: builder.mutation<User, UpdateUserPayload>({
			query: (userData) => ({
				url: '/users/me',
				method: 'PATCH',
				body: userData,
			}),
		}),
	}),
});

export const { useSignInMutation, useSignUpMutation, useChangeUserMutation } = authApi;
