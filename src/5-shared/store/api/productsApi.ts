import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './config';

export interface IErrorResponse {
	data: { statusCode: number; message: string; error: string };
	status: number;
}

interface ProductsResponse {
	products: Product[];
	length: number;
}

interface SetLikeResponse {
	like: {
		id: string;
		userId: string;
		productId: string;
	};
	message: string;
}
interface DeleteLikeResponse {
	product: {
		id: string;
		userId: string;
		productId: string;
	};
	message: string;
}
interface ProductRequest {
	page: number;
	perPage?: number;
	sort: Sort;
	searchText: string;
}

export const productsApi = createApi({
	reducerPath: 'productsApi',
	baseQuery: customBaseQuery,
	tagTypes: ['Products'],
	endpoints: (builder) => ({
		getProducts: builder.query<ProductsResponse, ProductRequest>({
			query: ({ searchText: searchTerm, sort, page, perPage }) => {
				return {
					url: '/products',
					params: {
						sort,
						searchTerm: searchTerm.length ? searchTerm : undefined,
						perPage: perPage ? page * perPage : undefined,
					},
				};
			},
			providesTags: [{ type: 'Products', id: 'list' }],
		}),
		getProduct: builder.query<Product, Pick<Product, 'id'>>({
			query: ({ id }) => ({ url: `/products/${id}` }),
			providesTags: (productFromBE) => [
				{ type: 'Products', id: productFromBE?.id },
			],
		}),

		createProduct: builder.mutation<Product, Product>({
			query: (product) => ({
				url: '/products',
				method: 'POST',
				body: product,
			}),
			invalidatesTags: [{ type: 'Products', id: 'list' }],
		}),

		deleteProduct: builder.mutation<Product, Pick<Product, 'id'>>({
			query: ({ id }) => ({
				url: `/products/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (productFromBE) => [
				{ type: 'Products', id: 'list' },
				{ type: 'Products', id: productFromBE?.id },
			],
		}),
		setLikeProduct: builder.mutation<SetLikeResponse, Pick<Product, 'id'>>({
			query: ({ id }) => ({
				url: `/products/${id}/likes`,
				method: 'PUT',
			}),
			invalidatesTags: (productFromBE) => [
				{ type: 'Products', id: 'list' },
				{ type: 'Products', id: productFromBE?.like.productId },
			],
		}),
		deleteLikeProduct: builder.mutation<
			DeleteLikeResponse,
			Pick<Product, 'id'>
		>({
			query: ({ id }) => ({
				url: `/products/${id}/likes`,
				method: 'DELETE',
			}),
			invalidatesTags: (productFromBE) => [
				{ type: 'Products', id: 'list' },
				{ type: 'Products', id: productFromBE?.product.productId },
			],
		}),
		getCategories: builder.query<Category[], void>({
			query: () => ({ url: '/categories' }),
		}),
		addReview: builder.mutation<
			Review,
			{ productId: string; text: string; rating: number }
		>({
			query: ({ productId, text, rating }) => ({
				url: `/reviews/leave/${productId}`,
				method: 'POST',
				body: { text, rating },
			}),
			invalidatesTags: (_result, _error, { productId }) => [
				{ type: 'Products', id: productId },
			],
		}),
	}),
});

export const {
	useGetProductQuery,
	useGetProductsQuery,
	useSetLikeProductMutation,
	useDeleteLikeProductMutation,
	useCreateProductMutation,
	useDeleteProductMutation,
	useAddReviewMutation,
	useGetCategoriesQuery,
} = productsApi;
