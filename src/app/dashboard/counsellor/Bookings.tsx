"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sessions = [
	{ id: 1, student: "Ravi Kumar", date: "Sept 20, 3:00 PM", status: "Confirmed" },
	{ id: 2, student: "Anita Singh", date: "Sept 22, 11:00 AM", status: "Pending" },
];

export default function CounsellorBookings() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>My Bookings</CardTitle>
			</CardHeader>
			<CardContent>
				<table className="w-full text-sm border">
					<thead className="bg-gray-100">
						<tr>
							<th className="p-2 text-left">Student</th>
							<th className="p-2 text-left">Date & Time</th>
							<th className="p-2 text-left">Status</th>
							<th className="p-2 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{sessions.map((s) => (
							<tr key={s.id} className="border-t">
								<td className="p-2">{s.student}</td>
								<td className="p-2">{s.date}</td>
								<td className="p-2">
									<Badge
										variant={
											s.status === "Confirmed"
												? "default"
												: s.status === "Pending"
													? "secondary"
													: "destructive"
										}
									>
										{s.status}
									</Badge>
								</td>
								<td className="p-2">
									<Button size="sm">Join</Button>
									<Button size="sm" variant="secondary" className="ml-2">
										Reschedule
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</CardContent>
		</Card>
	);
}
