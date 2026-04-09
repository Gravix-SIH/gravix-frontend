"use client";
import { useState } from "react";

export function useAdminDashboard() {
	const [stats, setStats] = useState<unknown>(null);

	const fetchStats = async () => {
		const res = await fetch("/api/admin/stats");
		const data = await res.json();
		setStats(data);
	};

	return { stats, fetchStats };
}
