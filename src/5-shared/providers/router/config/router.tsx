import { createBrowserRouter } from 'react-router-dom';

import { HomePage } from 'pages/HomePage';
import { ProductPage } from 'pages/ProductPage';
import { NotFoundPage } from 'pages/NotFoundPage';
import { ProfilePage } from 'pages/ProfilePage';
import { FavoritesPage } from 'pages/FavoritesPage';
import { App } from 'app';
import { SignUpPage } from 'pages/SignUpPage';
import { SignInPage } from 'pages/SignInPage';
import { CartPage } from 'pages/CartPage';
import { CreateProductPage } from 'pages/CreateProductPage';

export enum AppRoutes {
	HOME = 'home',
	FAVORITES = 'favorites',
	PRODUCTS = 'products',
	PROFILE = 'profile',
	CART = 'cart',
	SIGNUP = 'signup',
	SIGNIN = 'signin',
	CREATE_PRODUCT = 'create_product',
	NOT_FOUND = 'not_found',
}

export const RoutePath: Record<AppRoutes, `/${string}` | '*'> = {
	[AppRoutes.HOME]: '/',
	[AppRoutes.FAVORITES]: '/favorites',
	[AppRoutes.PRODUCTS]: '/products/:productId',
	[AppRoutes.PROFILE]: '/profile',
	[AppRoutes.CART]: '/cart',
	[AppRoutes.SIGNUP]: '/signup',
	[AppRoutes.SIGNIN]: '/signin',
	[AppRoutes.CREATE_PRODUCT]: '/products/new',
	[AppRoutes.NOT_FOUND]: '*',
};

export const router = createBrowserRouter([
	{
		path: RoutePath.home,
		element: <App />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: RoutePath.favorites,
				element: <FavoritesPage />,
			},
			{
				path: RoutePath.products,
				element: <ProductPage />,
			},
			{
				path: RoutePath.profile,
				element: <ProfilePage />,
			},
			{
				path: RoutePath.cart,
				element: <CartPage />,
			},
			{
				path: RoutePath.signup,
				element: <SignUpPage />,
			},
			{
				path: RoutePath.signin,
				element: <SignInPage />,
			},
			{
				path: RoutePath.create_product,
				element: <CreateProductPage />,
			},

			// last route
			{
				path: RoutePath.not_found,
				element: <NotFoundPage />,
			},
		],
	},
]);
