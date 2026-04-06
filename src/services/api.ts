import { TokenStorage } from "@/utils/storage";

class ApiService {
	private baseURL: string;
	private isRefreshing = false;
	private refreshPromise: Promise<string> | null = null;

	constructor() {
		this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
	}

	private async refreshAccessToken(): Promise<string> {
		const refreshToken = TokenStorage.getRefreshToken();

		if (!refreshToken) {
			throw new Error('No refresh token available');
		}

		const response = await fetch(`${this.baseURL}/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refresh: refreshToken }),
		});

		if (!response.ok) {
			TokenStorage.clearTokens();
			window.location.href = '/login';
			throw new Error('Failed to refresh token');
		}

		const data = await response.json();
		const newTokens = { access: data.access, refresh: refreshToken };
		TokenStorage.setTokens(newTokens);

		return data.access;
	}

	private async getValidAccessToken(): Promise<string> {
		const accessToken = TokenStorage.getAccessToken();

		if (!accessToken) {
			throw new Error('No access token available');
		}

		// Check if token is expired (basic check)
		try {
			const payload = JSON.parse(atob(accessToken.split('.')[1]));
			const currentTime = Date.now() / 1000;

			// If token expires in less than 5 minutes, refresh it
			if (payload.exp - currentTime < 300) {
				if (!this.isRefreshing) {
					this.isRefreshing = true;
					this.refreshPromise = this.refreshAccessToken();
				}

				const newToken = await this.refreshPromise!;
				this.isRefreshing = false;
				this.refreshPromise = null;
				return newToken;
			}

			return accessToken;
		} catch (error) {
			// If token is invalid, try to refresh
			return await this.refreshAccessToken();
		}
	}

	async request<T>(
		endpoint: string,
		options: RequestInit = {},
		requiresAuth = true
	): Promise<T> {
		const url = `${this.baseURL}${endpoint}`;
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			...options.headers,
		};

		if (requiresAuth) {
			try {
				const accessToken = await this.getValidAccessToken();
				(headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
			} catch (error) {
				// Redirect to login if authentication fails
				window.location.href = '/login';
				throw error;
			}
		}

		const response = await fetch(url, {
			...options,
			headers,
		});

		if (!response.ok) {
			if (response.status === 401 && requiresAuth) {
				// Token might be invalid, try to refresh and retry once
				try {
					const newAccessToken = await this.refreshAccessToken();
					const retryResponse = await fetch(url, {
						...options,
						headers: {
							...headers,
							Authorization: `Bearer ${newAccessToken}`,
						},
					});

					if (!retryResponse.ok) {
						throw new Error(`HTTP error! status: ${retryResponse.status}`);
					}

					return await retryResponse.json();
				} catch (refreshError) {
					window.location.href = '/login';
					throw refreshError;
				}
			}

			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
		}

		return await response.json();
	}

	// GET request
	async get<T>(endpoint: string, requiresAuth = true): Promise<T> {
		return this.request<T>(endpoint, { method: 'GET' }, requiresAuth);
	}

	// POST request
	async post<T>(endpoint: string, data?: any, requiresAuth = true): Promise<T> {
		return this.request<T>(
			endpoint,
			{
				method: 'POST',
				body: data ? JSON.stringify(data) : undefined,
			},
			requiresAuth
		);
	}

	// PUT request
	async put<T>(endpoint: string, data?: any, requiresAuth = true): Promise<T> {
		return this.request<T>(
			endpoint,
			{
				method: 'PUT',
				body: data ? JSON.stringify(data) : undefined,
			},
			requiresAuth
		);
	}

	// PATCH request
	async patch<T>(endpoint: string, data?: any, requiresAuth = true): Promise<T> {
		return this.request<T>(
			endpoint,
			{
				method: 'PATCH',
				body: data ? JSON.stringify(data) : undefined,
			},
			requiresAuth
		);
	}

	// DELETE request
	async delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
		return this.request<T>(endpoint, { method: 'DELETE' }, requiresAuth);
	}
}

export const apiService = new ApiService();
