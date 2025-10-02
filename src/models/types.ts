import { User } from "./User";

export interface AuthTokens {
	access: string;
	refresh: string;
}

export interface AuthResponse extends AuthTokens {
	user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  name: string;
  password: string;
  role: "student" | "counsellor";
  department?: string;
}