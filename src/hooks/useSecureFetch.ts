"use client";
import { useAuth } from "./useAuth";

export function useSecureFetch() {
    const { user, getToken } = useAuth();

    const secureFetch = async (url: string, options: RequestInit = {}) => {
        const token = user ? await getToken() : null;

        const headers = new Headers(options.headers);
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        return fetch(url, { ...options, headers });
    };

    return { secureFetch };
}