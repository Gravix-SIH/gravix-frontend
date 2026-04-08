import { CounselorResponse } from "@/services/studentService";

// ============== Booking Configuration ==============
export const MIN_BOOKING_LEAD_HOURS = 2;
export const MAX_BOOKING_ADVANCE_DAYS = 14;
export const ALLOW_SAME_DAY_BOOKING = false;
export const ALLOW_SAME_DAY_CRISIS_BOOKING = true;
export const WEEKENDS_UNAVAILABLE = true;
export const MAX_NOTES_LENGTH = 500;
export const SLOT_FETCH_TIMEOUT_MS = 10000;

// ============== Date Checks ==============

/**
 * Checks if a date is beyond the maximum advance booking window
 */
export function isBeyondMaxAdvance(date: Date): boolean {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const maxDate = new Date(now);
	maxDate.setDate(maxDate.getDate() + MAX_BOOKING_ADVANCE_DAYS);
	return date > maxDate;
}

/**
 * Checks if a slot is within the minimum lead time window
 */
export function isWithinMinimumLeadTime(date: Date, time: string): boolean {
	const now = new Date();
	const [timePart, ampm] = time.split(' ');
	const [hourStr, minuteStr] = timePart.split(':');
	let hour = parseInt(hourStr, 10);
	const minute = parseInt(minuteStr, 10);

	if (ampm === 'PM' && hour !== 12) hour += 12;
	if (ampm === 'AM' && hour === 12) hour = 0;

	const slotTime = new Date(date);
	slotTime.setHours(hour, minute, 0, 0);

	const hoursUntilSlot = (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);
	return hoursUntilSlot < MIN_BOOKING_LEAD_HOURS && hoursUntilSlot > 0;
}

/**
 * Checks if a date is today
 */
export function isSameDay(date: Date): boolean {
	const today = new Date();
	return date.toDateString() === today.toDateString();
}

/**
 * Checks if a date falls on a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
	const day = date.getDay();
	return day === 0 || day === 6;
}

/**
 * Checks if a date is in the past (before today)
 */
export function isPastDate(date: Date): boolean {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return date < today;
}

/**
 * Checks if a time slot has already passed on a given date
 */
export function isPastTimeSlot(date: Date, time: string): boolean {
	const now = new Date();
	if (!isSameDay(date)) return false;

	const [timePart, ampm] = time.split(' ');
	const [hourStr, minuteStr] = timePart.split(':');
	let hour = parseInt(hourStr, 10);
	const minute = parseInt(minuteStr, 10);

	if (ampm === 'PM' && hour !== 12) hour += 12;
	if (ampm === 'AM' && hour === 12) hour = 0;

	const slotTime = new Date();
	slotTime.setHours(hour, minute, 0, 0);

	return slotTime <= now;
}

/**
 * Checks if a date should be disabled (past, same-day, weekend, or beyond max advance)
 * @param date - The date to check
 * @param allowCrisisSameDay - If true, same-day booking is allowed for crisis situations
 */
export function isDateDisabled(
	date: Date,
	allowCrisisSameDay = false
): { disabled: boolean; reason?: string } {
	if (isPastDate(date)) {
		return { disabled: true, reason: 'Past dates are not available' };
	}

	if (isSameDay(date) && !ALLOW_SAME_DAY_BOOKING && !allowCrisisSameDay) {
		return { disabled: true, reason: 'Same-day bookings are not available. Please select tomorrow or later.' };
	}

	if (WEEKENDS_UNAVAILABLE && isWeekend(date)) {
		return { disabled: true, reason: 'Weekend bookings are not available' };
	}

	if (isBeyondMaxAdvance(date)) {
		return { disabled: true, reason: `Bookings available up to ${MAX_BOOKING_ADVANCE_DAYS} days in advance` };
	}

	return { disabled: false };
}

/**
 * Checks if a time slot should be disabled
 * @param time - The time string (e.g., "9:00 AM")
 * @param date - The selected date
 * @param isBooked - Whether the slot is already booked
 */
export function isSlotDisabled(
	time: string,
	date: Date,
	isBooked: boolean
): { disabled: boolean; reason?: string } {
	if (isBooked) {
		return { disabled: true, reason: 'This slot is already booked' };
	}

	if (isPastTimeSlot(date, time)) {
		return { disabled: true, reason: 'This time has already passed' };
	}

	if (isWithinMinimumLeadTime(date, time)) {
		return { disabled: true, reason: `Book at least ${MIN_BOOKING_LEAD_HOURS} hours in advance` };
	}

	return { disabled: false };
}

// ============== Session Type Validation ==============

/**
 * Checks if a session type is supported by a counselor
 */
export function isSessionTypeSupported(
	counselor: CounselorResponse | null,
	type: string
): boolean {
	if (!counselor) return true;
	return counselor.session_types.includes(type as 'video' | 'in-person' | 'phone');
}

/**
 * Gets list of unsupported session types for a counselor
 */
export function getUnsupportedSessionTypes(
	counselor: CounselorResponse | null
): string[] {
	if (!counselor) return [];
	return (['video', 'in-person', 'phone'] as const).filter(
		(type) => !counselor.session_types.includes(type)
	);
}

// ============== Booking Limits ==============

/**
 * Parses time string to hour/minute for limit calculations
 */
export function parseTimeToMinutes(time: string): number {
	const [timePart, ampm] = time.split(' ');
	const [hourStr, minuteStr] = timePart.split(':');
	let hour = parseInt(hourStr, 10);
	const minute = parseInt(minuteStr, 10);

	if (ampm === 'PM' && hour !== 12) hour += 12;
	if (ampm === 'AM' && hour === 12) hour = 0;

	return hour * 60 + minute;
}
