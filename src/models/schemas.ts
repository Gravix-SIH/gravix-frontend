import { z } from "zod";

/* ---------------- User ---------------- */
export const UserSchema = z.object({
	uid: z.string(),
	anonId: z.string(),
	email: z.string().email(),
	name: z.string(),
	department: z.string().optional(),
	is_anonymous: z.boolean().default(false),
	role: z.enum(["student", "counsellor", "admin"]),
	created_at: z.date(),
	updated_at: z.date(),
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

/* ---------------- ForumPost ---------------- */
export const ForumPostSchema = z.object({
	id: z.string(),
	authorId: z.string(),
	title: z.string(),
	content: z.string(),
	tags: z.array(z.string()).optional(),
	createdAt: z.date(),
	updatedAt: z.date().optional(),
	upvotes: z.number(),
});
export type ForumPost = z.infer<typeof ForumPostSchema>;

/* ---------------- ForumComment ---------------- */
export const ForumCommentSchema = z.object({
	id: z.string(),
	postId: z.string(),
	authorId: z.string(),
	content: z.string(),
	createdAt: z.date(),
	upvotes: z.number(),
});
export type ForumComment = z.infer<typeof ForumCommentSchema>;

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
	type: z.enum(["booking", "assessment", "forum", "system"]),
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
