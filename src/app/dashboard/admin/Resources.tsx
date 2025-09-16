"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminResources() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Manage Resources</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-3">
					<li className="flex justify-between">
						<span>Meditation Guide (PDF)</span>
						<div>
							<Button size="sm">Edit</Button>
							<Button size="sm" variant="destructive" className="ml-2">Delete</Button>
						</div>
					</li>
					<li className="flex justify-between">
						<span>Sleep Hygiene Video</span>
						<div>
							<Button size="sm">Edit</Button>
							<Button size="sm" variant="destructive" className="ml-2">Delete</Button>
						</div>
					</li>
				</ul>
				<Button className="mt-4">Add New Resource</Button>
			</CardContent>
		</Card>
	);
}
