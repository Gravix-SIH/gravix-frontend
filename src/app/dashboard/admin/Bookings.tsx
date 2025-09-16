"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// Mock data
const bookings = [
	{
		id: 1,
		student: "Ravi Kumar",
		counsellor: "Dr. Meera",
		date: "2025-09-20 15:00",
		status: "Confirmed",
	},
	{
		id: 2,
		student: "Anita Singh",
		counsellor: "Dr. Raj",
		date: "2025-09-22 11:00",
		status: "Pending",
	},
	{
		id: 3,
		student: "Karan Patel",
		counsellor: "Dr. Meera",
		date: "2025-09-25 09:30",
		status: "Cancelled",
	},
];

export default function AdminBookings() {
	const [search, setSearch] = useState("");

	const filtered = bookings.filter(
		(b) =>
			b.student.toLowerCase().includes(search.toLowerCase()) ||
			b.counsellor.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<Card>
			<CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
				<CardTitle>All Bookings</CardTitle>
				<Input
					placeholder="Search by student or counsellor"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full md:w-64 mt-2 md:mt-0"
				/>
			</CardHeader>
			<CardContent>
				<table className="w-full text-sm border">
					<thead className="bg-gray-100">
						<tr>
							<th className="p-2 text-left">Student</th>
							<th className="p-2 text-left">Counsellor</th>
							<th className="p-2 text-left">Date & Time</th>
							<th className="p-2 text-left">Status</th>
							<th className="p-2 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filtered.map((b) => (
							<tr key={b.id} className="border-t">
								<td className="p-2">{b.student}</td>
								<td className="p-2">{b.counsellor}</td>
								<td className="p-2">{b.date}</td>
								<td className="p-2">
									<Badge
										variant={
											b.status === "Confirmed"
												? "default"
												: b.status === "Pending"
													? "secondary"
													: "destructive"
										}
									>
										{b.status}
									</Badge>
								</td>
								<td className="p-2">
									<Button size="sm" className="mr-2">
										View
									</Button>
									{b.status === "Pending" && (
										<Button size="sm" variant="secondary" className="mr-2">
											Approve
										</Button>
									)}
									<Button size="sm" variant="destructive">
										Cancel
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
