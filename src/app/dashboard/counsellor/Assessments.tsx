"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CounsellorAssessments() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Student Assessments</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-3">
					<li className="flex justify-between">
						<span>Stress Level Test – Ravi Kumar</span>
						<Button size="sm">Review</Button>
					</li>
					<li className="flex justify-between">
						<span>Sleep Quality Survey – Anita Singh</span>
						<Button size="sm">Review</Button>
					</li>
				</ul>
			</CardContent>
		</Card>
	);
}
