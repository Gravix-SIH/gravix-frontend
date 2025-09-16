"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CounsellorChat() {
	const [messages, setMessages] = useState<string[]>([]);
	const [input, setInput] = useState("");

	const handleSend = () => {
		if (!input.trim()) return;
		setMessages([...messages, `You: ${input}`]);
		setInput("");
	};

	return (
		<Card className="h-[600px] flex flex-col">
			<CardHeader>
				<CardTitle>Chat with AI Assistant</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col justify-between">
				<div className="overflow-y-auto space-y-2 p-2 border rounded bg-muted h-[450px]">
					{messages.length === 0 && <p className="text-sm text-gray-500">No messages yet...</p>}
					{messages.map((msg, i) => (
						<p key={i} className="text-sm">{msg}</p>
					))}
				</div>
				<div className="flex gap-2 mt-3">
					<Input
						placeholder="Type your message..."
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSend()}
					/>
					<Button onClick={handleSend}>Send</Button>
				</div>
			</CardContent>
		</Card>
	);
}
