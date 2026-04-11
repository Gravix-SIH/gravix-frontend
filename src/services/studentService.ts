import { apiService } from "./api";

// Meeting details for confirmed sessions
export interface MeetingDetails {
	meet_link?: string;
	address?: string;
	phone?: string;
}

// Override with concrete types
export interface BookingResponse {
	id: string;
	counsellor: string;
	counsellor_name: string;
	counsellor_specialty: string;
	date: string;
	time: string;
	session_type: "video" | "in-person" | "phone";
	status: "pending" | "confirmed" | "cancelled" | "completed";
	notes?: string;
	// Flat meeting details fields (from backend)
	meeting_link?: string | null;
	meeting_phone?: string | null;
	meeting_address?: string | null;
	// Nested meeting_details (may be used by backend)
	meeting_details?: { meet_link?: string; address?: string; phone?: string } | null;
	confirmed_at?: string | null;
}

export interface CounselorResponse {
	id: string;
	name: string;
	specialty: string;
	experience: string;
	rating: number;
	reviews: number;
	image?: string;
	languages: string[];
	education: string;
	next_available: string;
	session_types: ("video" | "in-person" | "phone")[];
	expertise: string[];
	bio: string;
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

export interface WeeklyHealthScoreResponse {
	score: number;
	change: number;
}

class StudentService {
	/**
	 * Get upcoming bookings for the current student
	 */
	async getUpcomingBookings(): Promise<BookingResponse[]> {
		try {
			// Cache-busting: add timestamp to prevent stale cache
			const timestamp = Date.now();
			const response = await apiService.get<BookingResponse[]>(`/v1/student/bookings/upcoming/?t=${timestamp}`, true);
			console.log('API Response for upcoming bookings:', JSON.stringify(response, null, 2));
			return response;
		} catch (error) {
			console.error('Failed to fetch upcoming bookings:', error);
			return [];
		}
	}

	/**
	 * Get all available counselors
	 */
	async getCounselors(): Promise<CounselorResponse[]> {
		try {
			const response = await apiService.get<CounselorResponse[]>('/v1/student/bookings/counsellors/', true);
			return response;
		} catch (error) {
			console.error('Failed to fetch counselors:', error);
			return [];
		}
	}

	/**
	 * Get resources for the student
	 */
	async getResources(category?: string): Promise<ResourceResponse[]> {
		try {
			const endpoint = category && category !== 'all'
				? `/v1/student/resources/?category=${category}`
				: '/v1/student/resources/';
			const response = await apiService.get<ResourceResponse[]>(endpoint, true);
			return response;
		} catch (error) {
			console.error('Failed to fetch resources:', error);
			return [];
		}
	}

	/**
	 * Get weekly health score
	 */
	async getWeeklyHealthScore(): Promise<WeeklyHealthScoreResponse | null> {
		try {
			const response = await apiService.get<WeeklyHealthScoreResponse>('/v1/student/health/score/', true);
			return response;
		} catch (error) {
			console.error('Failed to fetch weekly health score:', error);
			return null;
		}
	}

	/**
	 * Book a session with a counselor
	 */
	async bookSession(payload: {
		counsellor_id: string;
		date: string;
		time: string;
		session_type: "video" | "in-person" | "phone";
		notes?: string;
	}): Promise<BookingResponse> {
		const response = await apiService.post<BookingResponse>('/v1/student/bookings/', {
			counsellor: payload.counsellor_id,
			date: payload.date,
			time: payload.time,
			session_type: payload.session_type,
			notes: payload.notes
		}, true);
		return response;
	}

	/**
	 * Cancel a booking
	 */
	async cancelBooking(bookingId: string): Promise<void> {
		await apiService.delete(`/v1/student/bookings/${bookingId}/`, true);
	}

	/**
	 * Get booked time slots for a counselor on a given date
	 */
	async getBookedSlots(counsellorId: string, date: string): Promise<string[]> {
		try {
			const response = await apiService.get<{times: string[]}>(
				`/v1/student/bookings/slots/?counsellor=${counsellorId}&date=${date}`,
				true
			);
			return response.times || [];
		} catch {
			return [];
		}
	}

	/**
	 * Get bookmarked resources
	 */
	async getBookmarkedResources(): Promise<ResourceResponse[]> {
		try {
			const response = await apiService.get<{ id: string; resource: ResourceResponse; created_at: string }[]>(
				'/v1/student/resources/bookmarks/',
				true
			);
			return response.map((b: { id: string; resource: ResourceResponse; created_at: string }) => b.resource);
		} catch (error) {
			console.error('Failed to fetch bookmarked resources:', error);
			return [];
		}
	}

	/**
	 * Bookmark a resource
	 */
	async bookmarkResource(resourceId: string): Promise<void> {
		await apiService.post(`/v1/student/resources/${resourceId}/bookmark/`, {}, true);
	}

	/**
	 * Remove bookmark from a resource
	 */
	async removeBookmark(resourceId: string): Promise<void> {
		await apiService.delete(`/v1/student/resources/${resourceId}/bookmark/`, true);
	}

	/**
	 * Get student's booking counts for limit checking
	 */
	async getBookingCount(): Promise<{ daily: number; weekly: number }> {
		try {
			const response = await apiService.get<{ daily: number; weekly: number }>(
				'/v1/student/bookings/count/',
				true
			);
			return response;
		} catch {
			return { daily: 0, weekly: 0 };
		}
	}
}

export const studentService = new StudentService();

// ============= Chat Service =============

interface NewChatRequest {
	anonymous_id?: string;
}

interface NewChatResponse {
	session_id: string;
	timestamp: string;
}

interface SendMessageRequest {
	message: string;
	session_id: string;
	anonymous_id?: string;
}

interface SendMessageResponse {
	reply: string;
	emotion?: string;
	crisis?: boolean;
	session_id: string;
}

interface SessionHistoryResponse {
	sessions: {
		session_id: string;
		title: string;
		created_at: string;
		last_active: string;
	}[];
}

interface ConversationHistoryResponse {
	conversations: {
		message: string;
		sender: "user" | "bot";
		timestamp: string;
		mood?: string;
	}[];
}

interface MoodSummaryResponse {
	mood_summary: {
		mood: string;
		intensity: number;
		timestamp: string;
	}[];
}

class ChatService {
	/**
	 * Check API health status
	 */
	async healthCheck(): Promise<{ status: string; timestamp: string }> {
		const response = await apiService.get<{ status: string; timestamp: string }>('/v1/chatbot/health/', false);
		return response;
	}

	/**
	 * Create a new chat session. Uses JWT auth for authenticated users,
	 * falls back to anonymous_id for unauthenticated/anonymous users.
	 */
	async newChat(anonymousId?: string): Promise<NewChatResponse> {
		const payload: NewChatRequest = {};
		if (anonymousId) {
			payload.anonymous_id = anonymousId;
		}
		// Use requiresAuth=true so JWT is sent for authenticated users
		// For anonymous users (no JWT), backend falls back to anonymous_id
		const response = await apiService.post<NewChatResponse>('/v1/chatbot/chat/new/', payload, true);
		return response;
	}

	/**
	 * Send a message to the chatbot
	 */
	async sendMessage(message: string, sessionId: string, anonymousId?: string): Promise<SendMessageResponse> {
		const payload: SendMessageRequest = { message, session_id: sessionId };
		if (anonymousId) {
			payload.anonymous_id = anonymousId;
		}
		const response = await apiService.post<SendMessageResponse>('/v1/chatbot/chat/', payload, true);
		return response;
	}

	/**
	 * Get all chat sessions
	 */
	async getHistory(): Promise<SessionHistoryResponse> {
		const response = await apiService.get<SessionHistoryResponse>('/v1/chatbot/chat/history/', true);
		return response;
	}

	/**
	 * Get conversation history for a session
	 */
	async getChat(sessionId: string): Promise<ConversationHistoryResponse> {
		const response = await apiService.get<ConversationHistoryResponse>(`/v1/chatbot/chat/history/${sessionId}/`, true);
		return response;
	}

	/**
	 * Get conversation history (alias)
	 */
	async getConversationHistory(sessionId: string): Promise<ConversationHistoryResponse> {
		return this.getChat(sessionId);
	}

	/**
	 * Get mood summary for a session
	 */
	async getMoodSummary(sessionId: string): Promise<MoodSummaryResponse> {
		const response = await apiService.get<MoodSummaryResponse>(`/v1/chatbot/chat/mood/${sessionId}/`, true);
		return response;
	}

	/**
	 * Delete a chat session
	 */
	async deleteSession(sessionId: string): Promise<void> {
		await apiService.delete(`/v1/chatbot/chat/${sessionId}/`, true);
	}
}

export const chatService = new ChatService();

// ============= Assessment Service =============

export interface AssessmentResultPayload {
  assessment_type: "phq9" | "gad7" | "psqi";
  score: number;
  answers: number[];
}

export interface AssessmentResultResponse {
  id: string;
  assessment_type: string;
  score: number;
  max_score: number;
  severity: string;
  answers: number[];
  created_at: string;
}

class AssessmentService {
  /**
   * Get all assessments for the current user
   */
  async getAssessments(): Promise<AssessmentResultResponse[]> {
    try {
      const response = await apiService.get<AssessmentResultResponse[]>('/v1/student/assessments/', true);
      return response;
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      return [];
    }
  }

  /**
   * Submit a new assessment result
   */
  async submitAssessment(payload: AssessmentResultPayload): Promise<AssessmentResultResponse> {
    const response = await apiService.post<AssessmentResultResponse>('/v1/student/assessments/', payload, true);
    return response;
  }

  /**
   * Get a specific assessment result
   */
  async getAssessment(id: string): Promise<AssessmentResultResponse | null> {
    try {
      const response = await apiService.get<AssessmentResultResponse>(`/v1/student/assessments/${id}/`, true);
      return response;
    } catch (error) {
      console.error('Failed to fetch assessment:', error);
      return null;
    }
  }
}

export const assessmentService = new AssessmentService();
