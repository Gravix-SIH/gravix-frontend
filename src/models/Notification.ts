export type NotificationType = "booking" | "assessment" | "forum" | "system";

export interface Notification {
	id: string;
	userId: string;
	type: NotificationType;
	message: string;
	read: boolean;
	createdAt: Date;
}
