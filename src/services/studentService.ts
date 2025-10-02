import { apiService } from "./api";


interface HealthCheckResponse {
	status: string;
	timestamp: string;
}

class ChatService {
	/**
	 * Check API health status
	 */
	async healthCheck(): Promise<HealthCheckResponse> {
		const response = await apiService.get<HealthCheckResponse>('/v1/chatbot/health', true);
		return response;
	}

	/**
	 * Create a new chat session
	 * @param anonymousId - Optional anonymous user identifier
	 */
	async newChat(anonymousId?: string): Promise<NewChatResponse> {
		const payload: NewChatRequest = {};
		if (anonymousId) {
			payload.anonymous_id = anonymousId;
		}

		const response = await apiService.post<NewChatResponse>('/v1/chatbot/chat/new/', payload, true);
		return response;
	}

	/**
	 * Send a message to the chatbot
	 * @param message - The user message
	 * @param sessionId - The chat session ID
	 * @param anonymousId - Optional anonymous user identifier
	 */
	async sendMessage(
		message: string,
		sessionId: string,
		anonymousId?: string
	): Promise<SendMessageResponse> {
		const payload: SendMessageRequest = {
			message,
			session_id: sessionId,
		};

		if (anonymousId) {
			payload.anonymous_id = anonymousId;
		}

		const response = await apiService.post<SendMessageResponse>('/v1/chatbot/chat/', payload, true);
		return response;
	}


	/**
	 * Get all chat sessions with titles
	 */
	async getHistory(): Promise<SessionHistoryResponse> {
		const response = await apiService.get<SessionHistoryResponse>('/v1/chatbot/chat/history', true);
		return response;
	}

	/**
	 * Get conversation history for a specific session
	 * @param sessionId - The chat session ID
	 */
	async getChat(sessionId: string): Promise<ConversationHistoryResponse> {
		const response = await apiService.get<ConversationHistoryResponse>(`/v1/chatbot/chat/history/${sessionId}`, true);
		return response;
	}

	/**
	 * Get conversation history for a specific session (alternative method name)
	 */
	async getConversationHistory(sessionId: string): Promise<ConversationHistoryResponse> {
		return this.getChat(sessionId);
	}

	/**
	 * Get mood tracking data for a session
	 * @param sessionId - The chat session ID
	 */
	async getMoodSummary(sessionId: string): Promise<MoodSummaryResponse> {
		const response = await apiService.get<MoodSummaryResponse>(`/v1/chatbot/chat/mood/${sessionId}`, true);
		return response;
	}

	/**
	 * Get all sessions (alias for getHistory for better naming)
	 */
	async getAllSessions(): Promise<SessionHistoryResponse> {
		return this.getHistory();
	}
}

export const chatService = new ChatService();