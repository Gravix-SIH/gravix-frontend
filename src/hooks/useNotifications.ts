"use client";
import { useState } from "react";

export function useNotifications() {
	const [notifications, setNotifications] = useState<Record<string, unknown>[]>([]);

	const fetchNotifications = async () => {
		const res = await fetch("/api/notifications");
		const data = await res.json();
		setNotifications(data);
	};

	return { notifications, fetchNotifications };
}
