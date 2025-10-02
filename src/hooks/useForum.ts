"use client";
import { useState } from "react";

export function useForum() {
	const [posts, setPosts] = useState<any[]>([]);

	const fetchPosts = async () => {
		const res = await fetch("/api/forum");
		const data = await res.json();
		setPosts(data);
	};

	const createPost = async (content: string) => {
		const res = await fetch("/api/forum", {
			method: "POST",
			body: JSON.stringify({ content }),
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();
		setPosts((prev) => [...prev, data]);
	};

	return { posts, fetchPosts, createPost };
}
