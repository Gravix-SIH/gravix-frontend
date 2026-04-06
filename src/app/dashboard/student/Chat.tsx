"use client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Plus, History, Trash2, Send, AlertCircle, LoaderPinwheel } from "lucide-react";
import { chatService } from "@/services/studentService"; // Adjust path as needed
import { toast } from "sonner"; // Assuming you're using sonner for toast notifications
import { useAuth } from "@/hooks/useAuth";
import ReactMarkdown from "react-markdown";

interface Message {
	role: "bot" | "user";
	text: string;
	timestamp: Date;
	mood?: string | null;
}

interface ChatSession {
	id: string;
	title: string;
	messages: Message[];
	created_at: Date;
	last_active: Date;
}

export default function StudentChat({setShowSection}: {setShowSection: (section: string) => void}) {
	const { user } = useAuth();
	const [sessions, setSessions] = useState<ChatSession[]>([]);
	const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
	const [input, setInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [showCrisisAlert, setShowCrisisAlert] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Load existing sessions on component mount
	useEffect(() => {
		loadSessions();
	}, []);

	const loadSessions = async () => {
		try {
			setIsLoading(true);
			setError(null);

			// Check API health first
			await chatService.healthCheck();

			// Load all sessions
			const historyResponse = await chatService.getHistory();

			if (historyResponse.sessions.length === 0) {
				// Create a default session if none exist
				await createNewChat();
			} else {
				// Convert API sessions to local format and load conversations
				const loadedSessions = await Promise.all(
					historyResponse.sessions.map(async (apiSession) => {
						try {
							const conversationResponse = await chatService.getConversationHistory(apiSession.session_id);

							const messages: Message[] = conversationResponse.conversations.map(conv => ({
								role: conv.sender === 'user' ? 'user' : 'bot',
								text: conv.message,
								timestamp: new Date(conv.timestamp),
								mood: conv.mood
							}));

							return {
								id: apiSession.session_id,
								title: apiSession.title,
								messages,
								created_at: new Date(apiSession.created_at),
								last_active: messages.length > 0 ?
									new Date(Math.max(...messages.map(m => m.timestamp.getTime()))) :
									new Date(apiSession.created_at)
							};
						} catch (error) {
							console.error(`Failed to load conversation for session ${apiSession.session_id}:`, error);
							// Return session with empty messages if conversation fails to load
							return {
								id: apiSession.session_id,
								title: apiSession.title,
								messages: [],
								created_at: new Date(apiSession.created_at),
								last_active: new Date(apiSession.created_at)
							};
						}
					})
				);

				setSessions(loadedSessions);
				if (loadedSessions.length > 0) {
					setCurrentSessionId(loadedSessions[0].id);
				}
			}
		} catch (error) {
			console.error('Failed to load sessions:', error);
			setError('Failed to load chat sessions. Please try again.');
			// Create a default session as fallback
			await createNewChat();
		} finally {
			setIsLoading(false);
		}
	};

	const currentSession = sessions.find(s => s.id === currentSessionId);

	const createNewChat = async () => {
		try {
			// Create new session via API
			const newSessionResponse = await chatService.newChat(user?.is_anonymous ? user.anon_id : undefined);

			const newSession: ChatSession = {
				id: newSessionResponse.session_id,
				title: "New Conversation",
				messages: [],
				created_at: new Date(newSessionResponse.timestamp),
				last_active: new Date(newSessionResponse.timestamp)
			};

			setSessions(prev => [newSession, ...prev]);
			setCurrentSessionId(newSession.id);

			toast.success('New chat session created');
		} catch (error) {
			console.error('Failed to create new chat:', error);
			toast.error('Failed to create new chat session');
		}
	};

	const deleteSession = async (sessionId: string) => {
		try {
			// Note: The API doesn't have a delete endpoint, so we only remove locally
			setSessions(prev => prev.filter(s => s.id !== sessionId));

			if (currentSessionId === sessionId) {
				const remainingSessions = sessions.filter(s => s.id !== sessionId);
				if (remainingSessions.length > 0) {
					setCurrentSessionId(remainingSessions[0].id);
				} else {
					await createNewChat();
				}
			}

			toast.success('Chat session deleted');
		} catch (error) {
			console.error('Failed to delete session:', error);
			toast.error('Failed to delete session');
		}
	};

	const sendMessage = async () => {
		if (!input.trim() || !currentSessionId || isTyping) return;

		const userMessage: Message = {
			role: "user",
			text: input.trim(),
			timestamp: new Date()
		};

		// Optimistically update UI
		setSessions(prev => prev.map(session => {
			if (session.id === currentSessionId) {
				const updatedMessages = [...session.messages, userMessage];
				const isFirstUserMessage = session.messages.filter(m => m.role === "user").length === 0;

				return {
					...session,
					messages: updatedMessages,
					last_active: new Date(),
					title: isFirstUserMessage ? input.slice(0, 50) : session.title
				};
			}
			return session;
		}));

		const messageText = input;
		setInput("");
		setIsTyping(true);

		try {
			// Send message to API
			const response = await chatService.sendMessage(messageText, currentSessionId);

			const botMessage: Message = {
				role: "bot",
				text: response.response,
				timestamp: new Date(),
				mood: response.mood_detected
			};

			// Update with bot response
			setSessions(prev => prev.map(session =>
				session.id === currentSessionId
					? { ...session, messages: [...session.messages, botMessage], last_active: new Date() }
					: session
			));

			// Handle crisis detection
			if (response.crisis_detected) {
				setShowCrisisAlert(true);
			}

			// Show mood detection if available
			if (response.mood_detected) {
				toast.info(`Mood detected: ${response.mood_detected}`, {
					duration: 3000,
				});
			}

		} catch (error) {
			console.error('Failed to send message:', error);

			// Remove the optimistically added user message on error
			setSessions(prev => prev.map(session =>
				session.id === currentSessionId
					? { ...session, messages: session.messages.slice(0, -1) }
					: session
			));

			toast.error('Failed to send message. Please try again.');
		} finally {
			setIsTyping(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const formatDate = (date: Date) => {
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900">
					<LoaderPinwheel className='animate-spin' />
				</div>
			</div>
		);
	}

	// Error state
	if (error && sessions.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<div className="text-center max-w-md">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-800 mb-2">Connection Error</h3>
					<p className="text-text-secondary mb-4">{error}</p>
					<Button onClick={loadSessions} className="bg-gradient-to-r from-purple-500 to-indigo-500">
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-full">
			<AlertDialog open={showCrisisAlert} onOpenChange={setShowCrisisAlert}>
				<AlertDialogContent className="bg-background-dark/30 backdrop-blur-lg border border-red-300">
					<AlertDialogHeader>
						<AlertDialogTitle>Crisis Alert</AlertDialogTitle>
						<AlertDialogDescription className="text-text-secondary">
							It looks like you may be experiencing a crisis.
							We strongly recommend booking a session with a counsellor right now for immediate support.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Close</AlertDialogCancel>
						<AlertDialogAction className="bg-green-400 hover:bg-green-500 text-white" onClick={() => { setShowCrisisAlert(false); setShowSection("booking"); }}>
							Book Session
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{/* Sidebar */}
			<div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white/30 backdrop-blur-xl border-r border-white/20`}>
				<div className="p-4 border-b border-white/20">
					<Button
						onClick={createNewChat}
						className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg"
						disabled={isLoading}
					>
						<Plus className="w-4 h-4 mr-2" />
						New Chat
					</Button>
				</div>

				<div className="flex-1 overflow-y-auto h-full p-2">
					<div className="space-y-1">
						{sessions.map((session) => (
							<div
								key={session.id}
								className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:bg-white/20 ${currentSessionId === session.id ? 'bg-white/30 shadow-sm' : ''
									}`}
								onClick={() => setCurrentSessionId(session.id)}
							>
								<div className="flex-1 min-w-0">
									<div className="flex items-center mb-1">
										<MessageCircle className="w-4 h-4 mr-2 text-text-secondary" />
										<h3 className="text-sm font-medium truncate text-gray-700">
											{session.title}
										</h3>
									</div>
									<p className="text-xs text-text-secondary">
										{formatDate(session.last_active)} • {session.messages.length} messages
									</p>
								</div>
								<Button
									size="sm"
									variant="ghost"
									className="opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-red-500 p-1"
									onClick={(e) => {
										e.stopPropagation();
										deleteSession(session.id);
									}}
								>
									<Trash2 className="w-3 h-3" />
								</Button>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Main Chat Area */}
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<div className="p-4 border-b border-white/20 bg-white/20 backdrop-blur-xl">
					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSidebarOpen(!sidebarOpen)}
								className="mr-3 text-text-secondary"
							>
								<History className="w-5 h-5" />
							</Button>
							<h1 className="text-xl font-semibold text-gray-800">
								{currentSession?.title || "Student Chat"}
							</h1>
						</div>
					</div>
				</div>

				{/* Chat Messages */}
				<div className="flex-1 overflow-y-auto p-6 space-y-4">
					{currentSession?.messages.length === 0 && (
						<div className="flex justify-center items-center h-full">
							<div className="text-center text-text-secondary">
								<MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
								<p className="text-lg font-medium mb-2">Start a conversation</p>
								<p className="text-sm">Send a message to begin chatting with your AI assistant</p>
							</div>
						</div>
					)}

					{currentSession?.messages.map((message, index) => (
						<div
							key={index}
							className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
						>
							<div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg ${message.role === "user"
								? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-md"
								: "bg-white/70 backdrop-blur-sm text-gray-700 border border-white/30 rounded-bl-md"
								}`}>
								<p className="text-sm leading-relaxed whitespace-pre-wrap">
									<ReactMarkdown>{message.text}</ReactMarkdown>
								</p>
								<div className="flex items-center justify-between mt-1">
									<p className={`text-xs ${message.role === "user" ? "text-purple-100" : "text-text-secondary"
										}`}>
										{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
									</p>
									{message.mood && (
										<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
											{message.mood}
										</span>
									)}
								</div>
							</div>
						</div>
					))}

					{isTyping && (
						<div className="flex justify-start">
							<div className="bg-white/70 backdrop-blur-sm border border-white/30 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg">
								<div className="flex space-x-1">
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
									<div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Input Area */}
				<div className="p-4 border-t border-white/20 bg-white/25 backdrop-blur-xl">
					<div className="flex items-end space-x-3">
						<div className="flex-1 relative">
							<Input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Type your message..."
								className="pr-12 py-3 text-sm bg-white/50 border-white/30 !text-gray-700 rounded-2xl backdrop-blur-sm z-0 focus:bg-white/70 placeholder-black resize-none"
								disabled={isTyping || !currentSessionId}
							/>
							<Button
								onClick={sendMessage}
								disabled={!input.trim() || isTyping || !currentSessionId}
								className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-gradient-to-r from-purple-500 to-indigo-500 z-[100] cursor-pointer hover:from-purple-600 hover:to-indigo-600 rounded-full disabled:opacity-50"
							>
								<Send className="w-4 h-4" />
							</Button>
						</div>
					</div>
					<p className="text-xs text-text-secondary mt-2 text-center">
						Press Enter to send
					</p>
				</div>
			</div>
		</div>
	);
}