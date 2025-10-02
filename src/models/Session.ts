export interface Session {
	id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	ipAddress?: string;
	device?: string;
	createdAt: Date;
}
