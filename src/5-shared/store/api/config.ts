import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { RootState } from '../types';

export const customBaseQuery = fetchBaseQuery({
	baseUrl: process.env.API_URL,
	prepareHeaders: (headers, { getState }) => {
		const accessToken = (getState() as RootState).user.accessToken;

		if (accessToken) {
			headers.set('authorization', accessToken);
		}
		return headers;
	},
});
