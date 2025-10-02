"use client";
import { useEffect, useState } from "react";

export function useAnonId(realUid: string | null) {
	const [anonId, setAnonId] = useState<string | null>(null);

	useEffect(() => {
		if (!realUid) return;
		let stored = localStorage.getItem("anonId");
		if (!stored) {
			stored = `anon_${crypto.randomUUID()}`;
			localStorage.setItem("anonId", stored);
		}
		setAnonId(stored);
	}, [realUid]);

	return anonId;
}
