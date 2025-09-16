"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CounsellorResources() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Shared Resources</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-3">
					<li className="flex justify-between">
						<span>Meditation Guide (PDF)</span>
						<Button size="sm">Edit</Button>
					</li>
					<li className="flex justify-between">
						<span>Stress Management Video</span>
						<Button size="sm">Edit</Button>
					</li>
				</ul>
				<Button className="mt-4">Upload New Resource</Button>
			</CardContent>
		</Card>
	);
}
