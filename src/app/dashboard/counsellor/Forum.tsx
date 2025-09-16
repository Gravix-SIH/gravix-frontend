"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CounsellorForum() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Forum</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-3 text-sm">
					<li className="flex justify-between">
						<span>“Coping with exam stress” – 12 replies</span>
						<Button size="sm">Reply</Button>
					</li>
					<li className="flex justify-between">
						<span>“Healthy sleep routines” – 5 replies</span>
						<Button size="sm">Reply</Button>
					</li>
				</ul>
			</CardContent>
		</Card>
	);
}
