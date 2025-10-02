"use client";
import { useState } from "react";

export function useChatbot() {
	const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
	const [loading, setLoading] = useState(false);

	const sendMessage = async (msg: string) => {
		setMessages((prev) => [...prev, { sender: "user", text: msg }]);
		setLoading(true);

		const res = await fetch("/api/chatbot", {
			method: "POST",
			body: JSON.stringify({ message: msg }),
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();

		setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
		setLoading(false);
	};

	return { messages, loading, sendMessage };
}
