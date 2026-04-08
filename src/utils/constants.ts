export const APP_NAME = "Digital Mental Health Platform";

// ============== Booking Configuration ==============
export const BOOKING_CONFIG = {
	MIN_LEAD_HOURS: 2,
	MAX_ADVANCE_DAYS: 14,
	ALLOW_SAME_DAY: false,
	ALLOW_CRISIS_SAME_DAY: true,
	WEEKENDS_BLOCKED: true,
	MAX_NOTES_LENGTH: 500,
	SLOT_TIMEOUT_MS: 10000,
	COUNSELOR_REFRESH_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
	MAX_DAILY_BOOKINGS: 2,
	MAX_WEEKLY_BOOKINGS: 5,
} as const;

export const API_ROUTES = {
	CHATBOT: "/api/chatbot",
	ASSESSMENT: "/api/assessment",
	BOOKING: "/api/booking",
	RESOURCES: "/api/resources",
	ADMIN_STATS: "/api/admin/stats",
	ADMIN_USERS: "/api/admin/users",
	NOTIFICATIONS: "/api/notifications",
};
