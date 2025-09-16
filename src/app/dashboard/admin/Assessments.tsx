"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAssessments() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Manage Assessments</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-3">
					<li className="flex justify-between">
						<span>Stress Level Test</span>
						<div>
							<Button size="sm">Edit</Button>
							<Button size="sm" variant="destructive" className="ml-2">Delete</Button>
						</div>
					</li>
					<li className="flex justify-between">
						<span>Sleep Quality Survey</span>
						<div>
							<Button size="sm">Edit</Button>
							<Button size="sm" variant="destructive" className="ml-2">Delete</Button>
						</div>
					</li>
				</ul>
				<Button className="mt-4">Add New Assessment</Button>
			</CardContent>
		</Card>
	);
}
