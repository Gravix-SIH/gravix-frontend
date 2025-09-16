"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsers() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Manage Users</CardTitle>
			</CardHeader>
			<CardContent>
				<table className="w-full text-sm border">
					<thead className="bg-gray-100">
						<tr>
							<th className="p-2 text-left">Name</th>
							<th className="p-2 text-left">Role</th>
							<th className="p-2 text-left">Status</th>
							<th className="p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						<tr className="border-t">
							<td className="p-2">Ravi Kumar</td>
							<td className="p-2">Student</td>
							<td className="p-2">Active</td>
							<td className="p-2">
								<Button size="sm">Edit</Button>
								<Button size="sm" variant="destructive" className="ml-2">
									Delete
								</Button>
							</td>
						</tr>
						<tr className="border-t">
							<td className="p-2">Dr. Meera</td>
							<td className="p-2">Counsellor</td>
							<td className="p-2">Active</td>
							<td className="p-2">
								<Button size="sm">Edit</Button>
								<Button size="sm" variant="destructive" className="ml-2">
									Delete
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
				<Button className="mt-4">Add New User</Button>
			</CardContent>
		</Card>
	);
}
