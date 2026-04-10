export type UserRole = "student" | "counsellor" | "admin";

export interface User {
  id: string;
  email: string | null;
  name?: string;
  department?: string;
  role: UserRole;
  is_anonymous: boolean;
  anon_id?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
	user: User;
	access: string;
	refresh: string;
}

export interface JwtPayload {
  sub: string;
  role: UserRole;
  is_anonymous: boolean;
  anon_id?: string;
  email?: string;
  exp?: number;
  iat?: number;
}
