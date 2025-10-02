export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
	id: string;
	userId: string;
	counselorId: string;
	date: Date;
	status: BookingStatus;
	notes?: string;
	createdAt: Date;
}
