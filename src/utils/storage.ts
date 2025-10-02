import { AuthTokens } from "@/models/types";

// utils/storage.ts
export class TokenStorage {
	private static ACCESS_TOKEN_KEY = 'access_token';
	private static REFRESH_TOKEN_KEY = 'refresh_token';

	static setTokens(tokens: AuthTokens): void {
		if (typeof window !== 'undefined') {
			localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
			localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
		}
	}

	static getAccessToken(): string | null {
		if (typeof window !== 'undefined') {
			return localStorage.getItem(this.ACCESS_TOKEN_KEY);
		}
		return null;
	}

	static getRefreshToken(): string | null {
		if (typeof window !== 'undefined') {
			return localStorage.getItem(this.REFRESH_TOKEN_KEY);
		}
		return null;
	}

	static clearTokens(): void {
		if (typeof window !== 'undefined') {
			localStorage.removeItem(this.ACCESS_TOKEN_KEY);
			localStorage.removeItem(this.REFRESH_TOKEN_KEY);
		}
	}

	static hasTokens(): boolean {
		return !!(this.getAccessToken() && this.getRefreshToken());
	}
}