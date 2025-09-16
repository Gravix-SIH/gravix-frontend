"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentBooking() {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Book a Session</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-gray-600">Choose a counsellor and available slot.</p>
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Button>Dr. Meera – Sept 20, 3PM</Button>
						<Button>Dr. Raj – Sept 28, 11AM</Button>
						<Button>Dr. Kiran – Oct 1, 5PM</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
