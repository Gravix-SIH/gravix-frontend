import { z } from "zod";

/* ---------------- User ---------------- */
export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email().nullable(),
	name: z.string(),
	department: z.string().optional(),
	is_anonymous: z.boolean().default(false),
	role: z.enum(["student", "counsellor", "admin"]),
	anon_id: z.string().optional(),
	is_active: z.boolean().default(true),
	created_at: z.string().or(z.date()),
	updated_at: z.string().or(z.date()),
});
export type User = z.infer<typeof UserSchema>;

/* ---------------- Session ---------------- */
export const SessionSchema = z.object({
	id: z.string(),
	userId: z.string(),
	token: z.string(),
	expiresAt: z.date(),
	ipAddress: z.string().optional(),
	device: z.string().optional(),
	createdAt: z.date(),
});
export type Session = z.infer<typeof SessionSchema>;

/* ---------------- ChatMessage ---------------- */
export const ChatMessageSchema = z.object({
	id: z.string(),
	userId: z.string(),
	sender: z.enum(["user", "bot"]),
	message: z.string(),
	createdAt: z.date(),
	context: z.record(z.string(), z.any()).optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

/* ---------------- Assessment ---------------- */
export const AssessmentSchema = z.object({
	id: z.string(),
	userId: z.string(),
	type: z.string(),
	score: z.number(),
	result: z.string(),
	createdAt: z.date(),
});
export type Assessment = z.infer<typeof AssessmentSchema>;

/* ---------------- Booking ---------------- */
export const BookingSchema = z.object({
	id: z.string(),
	userId: z.string(),
	counselorId: z.string(),
	date: z.date(),
	status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
	notes: z.string().optional(),
	createdAt: z.date(),
});
export type Booking = z.infer<typeof BookingSchema>;

/* ---------------- Resource ---------------- */
export const ResourceSchema = z.object({
	id: z.string(),
	title: z.string(),
	type: z.enum(["article", "video", "document", "link"]),
	url: z.string().url(),
	description: z.string().optional(),
	createdAt: z.date(),
});
export type Resource = z.infer<typeof ResourceSchema>;

/* ---------------- Notification ---------------- */
export const NotificationSchema = z.object({
	id: z.string(),
	userId: z.string(),
	type: z.enum(["booking", "assessment", "system"]),
	message: z.string(),
	read: z.boolean(),
	createdAt: z.date(),
});
export type Notification = z.infer<typeof NotificationSchema>;

/* ---------------- AuditLog ---------------- */
export const AuditLogSchema = z.object({
	id: z.string(),
	actorId: z.string(),
	action: z.string(),
	target: z.string().optional(),
	timestamp: z.date(),
	ipAddress: z.string().optional(),
});
export type AuditLog = z.infer<typeof AuditLogSchema>;
