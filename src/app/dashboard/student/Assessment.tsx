"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentAssessment() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Available Assessments</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-3">
						<li className="flex justify-between">
							<span>Stress Level Test</span>
							<Button size="sm">Start</Button>
						</li>
						<li className="flex justify-between">
							<span>Anxiety Scale</span>
							<Button size="sm">Start</Button>
						</li>
						<li className="flex justify-between">
							<span>Sleep Quality Survey</span>
							<Button size="sm">Start</Button>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
