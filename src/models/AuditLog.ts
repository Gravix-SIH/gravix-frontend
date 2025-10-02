export interface AuditLog {
	id: string;
	actorId: string;       // who performed the action
	action: string;        // e.g., "DELETE_POST", "UPDATE_BOOKING"
	target?: string;       // affected resource id
	timestamp: Date;
	ipAddress?: string;
}
