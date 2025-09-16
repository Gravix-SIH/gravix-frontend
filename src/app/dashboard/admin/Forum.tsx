"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminForum() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Forum Moderation</CardTitle>
			</CardHeader>
			<CardContent>
				<ul className="space-y-3 text-sm text-gray-600">
					<li className="flex justify-between">
						<span>“Coping with exam stress” – flagged 2 times</span>
						<div>
							<Button size="sm">Approve</Button>
							<Button size="sm" variant="destructive" className="ml-2">Remove</Button>
						</div>
					</li>
					<li className="flex justify-between">
						<span>“Best apps for focus” – 15 replies</span>
						<div>
							<Button size="sm">Approve</Button>
							<Button size="sm" variant="destructive" className="ml-2">Remove</Button>
						</div>
					</li>
				</ul>
			</CardContent>
		</Card>
	);
}
