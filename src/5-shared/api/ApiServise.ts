type ConfigApi = {
	baseUrl: string;
	headers: HeadersInit;
};

type ProductListResponse = {
	products: Product[];
	length: number;
};

export type ProductLikeResponse = {
	like: Like;
	message: string;
};

export type UserUpdateDto = Partial<
	Omit<User, 'favoritesPost' | 'id'> & { password: string }
>;

export class Api {
	private baseUrl;
	private headers;

	constructor({ baseUrl, headers }: ConfigApi) {
		this.baseUrl = baseUrl;
		this.headers = headers;
	}

	private async onResponse<T>(res: Response): Promise<T> {
		return res.ok
			? res.json()
			: res.json().then((data) => Promise.reject(data));
	}

	private async request<T>(
		endpoint: string,
		options?: RequestInit
	): Promise<T> {
		const res = await fetch(`${this.baseUrl}${endpoint}`, {
			method: 'GET',
			...options,
			headers: { ...this.headers, ...options?.headers },
		});
		return await this.onResponse<T>(res);
	}

	async getAllProducts() {
		return await this.request<ProductListResponse>('/products');
	}

	async getProductById(productID: string) {
		return await this.request<Product>(`/products/${productID}`);
	}

	async changeLikeProductStatus(productID: string, like: boolean) {
		return await this.request<ProductLikeResponse>(
			`/products/${productID}/likes`,
			{
				method: like ? 'DELETE' : 'PUT',
			}
		);
	}

	async addProductReview(
		productID: string,
		{ text, rating }: Pick<Review, 'text' | 'rating'>
	) {
		return await this.request<Review>(`/reviews/leave/${productID}`, {
			method: 'POST',
			body: JSON.stringify({ text, rating }),
		});
	}

	async getUserInfo() {
		return await this.request<User>('/users/me');
	}

	async updateUser(user: UserUpdateDto) {
		return await this.request<User>('/users/me', {
			method: 'PATCH',
			body: JSON.stringify(user),
		});
	}
}

const config = {
	apiUrl: 'https://api.v2.react-learning.ru',
	apiToken:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNseW9mNXFyZDAwMDhuZW9zdXdrNHk3aXIiLCJlbWFpbCI6ImVhYW1vc292QGdtYWlsLmNvbSIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNzIxMTM0Njk1LCJleHAiOjE3MjExMzUyOTV9.fOgTu9DEX24rHY6ZSl7IiqmqzCNpLZIrOm34xJLL2aI',
};

const AppApi = new Api({
	baseUrl: config.apiUrl,
	headers: {
		'content-type': 'application/json',
		Authorization: `Bearer ${config.apiToken}`,
	},
});

export default AppApi;
