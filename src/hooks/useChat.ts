import { useMutation, useQueryClient } from '@tanstack/react-query';
import { containsCrisis } from '../utils/crisisKeywords';
import { ChatMessage } from '@/models';

interface SendMessagePayload {
	sessionId: string;
	content: string;
	[key: string]: unknown;
}

export function useSendMessage() {
	const qc = useQueryClient();

	return useMutation<ChatMessage, Error, SendMessagePayload>({
		mutationFn: async (payload: SendMessagePayload): Promise<ChatMessage> => {
			const isCrisis = containsCrisis(payload.content);

			const res = await fetch('/api/chat/send', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...payload, isCrisis }),
			});

			if (!res.ok) {
				throw new Error('Failed to send message');
			}

			const data: ChatMessage = await res.json();
			return data;
		},
		onSuccess: (_data, variables) => {
			qc.invalidateQueries({ queryKey: ['chat', variables.sessionId] });
		},
	});
}
