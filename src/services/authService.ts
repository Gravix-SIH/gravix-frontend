import { User } from "@/models";
import { TokenStorage } from "@/utils/storage";
import { apiService } from "./api";
import { AuthResponse, AuthTokens, LoginCredentials, SignupCredentials } from "@/models/types";

class AuthService {
	async signup(credentials: SignupCredentials): Promise<AuthResponse> {
		const response = await apiService.post<AuthResponse>('/signup', credentials, false);
		TokenStorage.setTokens({ access: response.access, refresh: response.refresh });
		return response;
	}

	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		const response = await apiService.post<AuthResponse>('/login', credentials, false);
		TokenStorage.setTokens({ access: response.access, refresh: response.refresh });
		return response;
	}

	async loginAnon() : Promise<AuthResponse> {
		const response = await apiService.post<AuthResponse>('/anon', {}, false);
		console.log("Anon", response);
		TokenStorage.setTokens({ access: response.access, refresh: response.refresh });
		return response;
	}

	async logout(): Promise<void> {
		try {
			const refreshToken = TokenStorage.getRefreshToken();
			if (refreshToken) {
				await apiService.post('/refresh', { refresh: refreshToken }, true);
			}
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			TokenStorage.clearTokens();
		}
	}

	async getCurrentUser(): Promise<User> {
		return await apiService.get<User>('/users/me', true);
	}

	async refreshToken(): Promise<AuthTokens> {
		const refreshToken = TokenStorage.getRefreshToken();
		if (!refreshToken) {
			throw new Error('No refresh token available');
		}

		const response = await apiService.post<{ access: string }>(
			'/auth/token/refresh/',
			{ refresh: refreshToken },
			false
		);

		const newTokens = { access: response.access, refresh: refreshToken };
		TokenStorage.setTokens(newTokens);
		return newTokens;
	}

	isAuthenticated(): boolean {
		return TokenStorage.hasTokens();
	}

	async checkAuthStatus(): Promise<boolean> {
		if (!this.isAuthenticated()) {
			return false;
		}

		try {
			await this.getCurrentUser();
			return true;
		} catch (error) {
			TokenStorage.clearTokens();
			return false;
		}
	}
}

export const authService = new AuthService();
