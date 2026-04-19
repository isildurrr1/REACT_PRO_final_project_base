import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const SESSION_KEY = 'auth';

interface UserState {
	user: Partial<User> | null;
	accessToken: string;
}

const createInitState = (): UserState => {
	try {
		const saved = sessionStorage.getItem(SESSION_KEY);
		if (saved) return JSON.parse(saved) as UserState;
	} catch {}
	return { user: null, accessToken: '' };
};

const saveSession = (state: UserState) => {
	try {
		sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
	} catch {}
};

export const userSlice = createSlice({
	name: 'user',
	initialState: createInitState(),
	reducers: {
		setAccessToken(state, action: PayloadAction<Pick<Token, 'accessToken'>>) {
			state.accessToken = action.payload.accessToken;
			saveSession({ user: state.user, accessToken: state.accessToken });
		},
		clearUser() {
			sessionStorage.removeItem(SESSION_KEY);
			return { user: null, accessToken: '' };
		},
		setUser: (state, action: PayloadAction<UserState['user']>) => {
			state.user = action.payload;
			saveSession({ user: state.user, accessToken: state.accessToken });
		},
	},
	selectors: {
		getUser: (state: UserState) => state.user,
		getAccessToken: (state: Token) => state.accessToken,
	},
});

export const userActions = { ...userSlice.actions };
export const userSelectors = userSlice.selectors;
