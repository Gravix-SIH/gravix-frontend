"use client";
import { useState } from "react";

export function useResources() {
	const [resources, setResources] = useState<any[]>([]);

	const fetchResources = async () => {
		const res = await fetch("/api/resources");
		const data = await res.json();
		setResources(data);
	};

	return { resources, fetchResources };
}
