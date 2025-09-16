"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StudentChat() {
	const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
		{ role: "bot", text: "Hello! How are you feeling today?" },
	]);
	const [input, setInput] = useState("");

	const sendMessage = () => {
		if (!input.trim()) return;
		setMessages([...messages, { role: "user", text: input }, { role: "bot", text: "I hear you. Let’s work through it together." }]);
		setInput("");
	};

	// bind enter press for sending message
	

	return (
		<div className="flex flex-col border rounded-lg overflow-hidden h-full max-h-[87vh]">
			<div className="flex-1 overflow-y-auto bg-black/10 p-4 space-y-2">
				{messages.map((m, i) => (
					<div
						key={i}
						className={`p-2 rounded-lg max-w-xs shadow-lg ${m.role === "user" ? "bg-indigo-500 rounded-br-xs text-white ml-auto" : "bg-white/50 backdrop-blur-2xl rounded-bl-xs text-gray-700"}`}
					>
						{m.text}
					</div>
				))}
			</div>
			<div className="flex border-t bg-white/25 backdrop-blur-2xl p-4">
				<Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
				<Button onClick={sendMessage} className="ml-5">Send</Button>
			</div>
		</div>
	);
}
