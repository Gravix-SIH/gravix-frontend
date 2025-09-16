"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StudentResources() {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle>Guides</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="list-disc pl-6 text-sm text-gray-600 space-y-2">
						<li>Effective Study Habits</li>
						<li>Mindfulness Basics</li>
						<li>Time Management Tips</li>
					</ul>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Videos</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="list-disc pl-6 text-sm text-gray-600 space-y-2">
						<li>Guided Meditation (10 mins)</li>
						<li>Yoga for Stress Relief</li>
						<li>Breathing Exercises</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
