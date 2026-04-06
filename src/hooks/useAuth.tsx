"use client";
import { User } from '@/models';
import { LoginCredentials, SignupCredentials } from '@/models/types';
import { authService } from '@/services/authService';
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	loginAnonymous: () => Promise<void>;
	signup: (credentials: SignupCredentials) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
	checkInitialAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkInitialAuth();
	}, []);

	const checkInitialAuth = async () => {
		try {
			if (authService.isAuthenticated()) {
				const userData = await authService.getCurrentUser();
				setUser(userData);
			}
		} catch (error) {
			console.error('Initial auth check failed:', error);
			authService.logout();
		} finally {
			setLoading(false);
		}
	};

	const login = async (credentials: LoginCredentials) => {
		setLoading(true);
		try {
			const response = await authService.login(credentials);
			setUser(response.user);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const loginAnonymous = async () => {
		setLoading(true);
		try {
			const response = await authService.loginAnon();
			console.log("Anonymous login response:", response);
			setUser(response.user);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	}

	const signup = async (credentials: SignupCredentials) => {
		setLoading(true);
		try {
			const response = await authService.signup(credentials);
			setUser(response.user);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			await authService.logout();
			setUser(null);
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			setLoading(false);
		}
	};

	const refreshUser = async () => {
		try {
			const userData = await authService.getCurrentUser();
			setUser(userData);
		} catch (error) {
			console.error('Refresh user error:', error);
			setUser(null);
		}
	};

	const value = {
		user,
		loading,
		login,
		loginAnonymous,
		signup,
		logout,
		refreshUser,
		checkInitialAuth,
	};

	return (
		<AuthContext.Provider value={value as AuthContextType}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}