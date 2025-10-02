"use client";
import { useAuth } from "./useAuth";

export function useSecureFetch() {
	const { user, getToken } = useAuth();

	const secureFetch = async (url: string, options: RequestInit = {}) => {
		const token = user ? getToken() : null;
		const headers = {
			...options.headers,
			Authorization: token ? `Bearer ${token}` : "",
		};
		return fetch(url, { ...options, headers });
	};

	return { secureFetch };
}
