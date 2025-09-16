"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StudentForum() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Recent Discussions</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-3 text-sm text-gray-600">
						<li>“Coping with exam stress” – 14 replies</li>
						<li>“How to maintain work-life balance?” – 7 replies</li>
						<li>“Best relaxation apps?” – 5 replies</li>
					</ul>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Start a New Discussion</CardTitle>
				</CardHeader>
				<CardContent>
					<textarea
						className="w-full border rounded-lg p-2 text-sm"
						placeholder="Share your thoughts..."
						rows={3}
					/>
					<Button className="mt-2">Post</Button>
				</CardContent>
			</Card>
		</div>
	);
}
