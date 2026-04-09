"use client";
import { useState } from "react";

export function useAssessment() {
	const [results, setResults] = useState<Record<string, unknown> | null>(null);

	const submitAssessment = async (answers: Record<string, string>) => {
		const res = await fetch("/api/assessment", {
			method: "POST",
			body: JSON.stringify(answers),
			headers: { "Content-Type": "application/json" },
		});
		const data = await res.json();
		setResults(data);
		return data;
	};

	return { results, submitAssessment };
}
