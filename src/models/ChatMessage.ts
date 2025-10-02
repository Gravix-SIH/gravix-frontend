interface NewChatRequest {
	anonymous_id?: string;
}

interface NewChatResponse {
	session_id: string;
	status: string;
	timestamp: string;
}

interface SendMessageRequest {
	message: string;
	session_id: string;
	anonymous_id?: string;
}

interface SendMessageResponse {
	response: string;
	session_id: string;
	mood_detected?: string | null;
	crisis_detected?: boolean;
}

interface ChatSession {
	session_id: string;
	title: string;
	created_at: string;
}

interface SessionHistoryResponse {
	sessions: ChatSession[];
	total_count: number;
}

interface ConversationMessage {
	sender: 'user' | 'bot';
	message: string;
	timestamp: string;
	mood: string | null;
}

interface ConversationHistoryResponse {
	conversations: ConversationMessage[];
}

interface MoodData {
	mood: string;
	intensity: number;
	timestamp: string;
}

interface MoodSummaryResponse {
	mood_summary: MoodData[];
}