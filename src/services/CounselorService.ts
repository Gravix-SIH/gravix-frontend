import { apiService } from "./api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CounselorStats {
	upcoming_sessions: number;
	completed_sessions: number;
	students_seen: number;
	assessments_to_review: number;
	recent_submissions: number;
}

export interface CounselorBooking {
	id: string;
	student: string;
	student_name: string;
	student_email: string;
	counsellor: string;
	counsellor_name: string;
	counsellor_specialty: string;
	date: string;
	time: string;
	session_type: "video" | "in-person" | "phone";
	status: "pending" | "confirmed" | "cancelled" | "completed";
	notes: string;
	created_at: string;
}

export interface CounselorAssessment {
	id: string;
	user: string;
	user_name: string;
	user_email: string;
	assessment_type: "phq9" | "gad7" | "psqi";
	score: number;
	max_score: number;
	severity: string;
	answers: number[];
	created_at: string;
}

export interface ResourceResponse {
	id: string;
	title: string;
	type: "article" | "video" | "document" | "link" | "audio";
	url: string;
	description?: string;
	category: string;
	duration?: string;
	rating?: number;
}

export type BookingFilters = {
	status?: string;
};

// ─── Service ───────────────────────────────────────────────────────────────────

class CounselorService {
	// Stats
	async getStats(): Promise<CounselorStats> {
		return apiService.get<CounselorStats>("/counsellor/stats/");
	}

	// Bookings
	async getBookings(params?: BookingFilters): Promise<CounselorBooking[]> {
		const qs = params?.status ? `?status=${params.status}` : "";
		return apiService.get<CounselorBooking[]>(`/counsellor/bookings/${qs}`);
	}

	async updateBooking(
		id: string,
		data: { status: string }
	): Promise<CounselorBooking> {
		return apiService.patch<CounselorBooking>(
			`/counsellor/bookings/${id}/`,
			data
		);
	}

	// Assessments
	async getAssessments(params?: {
		assessment_type?: string;
		severity?: string;
	}): Promise<CounselorAssessment[]> {
		const searchParams = new URLSearchParams();
		if (params?.assessment_type)
			searchParams.set("assessment_type", params.assessment_type);
		if (params?.severity) searchParams.set("severity", params.severity);
		const qs = searchParams.toString();
		return apiService.get<CounselorAssessment[]>(
			`/counsellor/assessments/${qs ? `?${qs}` : ""}`
		);
	}

	// Resources (read-only, same as student endpoint)
	async getResources(category?: string): Promise<ResourceResponse[]> {
		const qs = category && category !== "all" ? `?category=${category}` : "";
		return apiService.get<ResourceResponse[]>(`/v1/student/resources/${qs}`);
	}
}

export const counselorService = new CounselorService();
