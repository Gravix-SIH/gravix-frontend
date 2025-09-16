"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function CounsellorOverview() {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<motion.div whileHover={{ scale: 1.02 }}>
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Sessions</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm">
							<li>Ravi Kumar – Sept 20, 3:00 PM</li>
							<li>Anita Singh – Sept 22, 11:00 AM</li>
						</ul>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div whileHover={{ scale: 1.02 }}>
				<Card>
					<CardHeader>
						<CardTitle>Pending Assessments</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm">5 assessments need review</p>
					</CardContent>
				</Card>
			</motion.div>

			<motion.div whileHover={{ scale: 1.02 }}>
				<Card>
					<CardHeader>
						<CardTitle>Forum Updates</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm">3 new posts awaiting counsellor input</p>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
