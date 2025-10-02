import { z } from "zod";

/* ---------------- Base API Response ---------------- */
export const ApiErrorSchema = z.object({
	code: z.string(),          // e.g., "UNAUTHORIZED", "NOT_FOUND"
	message: z.string(),       // Human readable message
	details: z.any().optional() // Optional extra error data
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

/**
 * Generic API Response Wrapper
 * All responses must follow this format
 */
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		data: dataSchema.optional(),
		error: ApiErrorSchema.optional(),
	});

/* ---------------- Utility Types ---------------- */
export type ApiResponse<T> =
	| { success: true; data: T }
	| { success: false; error: ApiError };
