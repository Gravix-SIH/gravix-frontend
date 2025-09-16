"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const logs = [
	{ id: 1, action: "User Ravi Kumar booked a session", time: "2025-09-12 14:23" },
	{ id: 2, action: "Admin updated Stress Test assessment", time: "2025-09-13 09:12" },
	{ id: 3, action: "Counsellor Dr. Meera uploaded new resource", time: "2025-09-14 16:45" },
];

export default function AdminLogs() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>System Logs</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-3 text-sm text-gray-600">
					{logs.map((log) => (
						<li
							key={log.id}
							className="border-b pb-2 last:border-none last:pb-0"
						>
							<p>{log.action}</p>
							<span className="text-xs text-gray-400">{log.time}</span>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
