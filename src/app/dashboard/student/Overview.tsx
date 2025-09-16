"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StudentOverview() {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{/* Recent Assessments */}
			<motion.div whileHover={{ scale: 1.02 }}>
				<Card>
					<CardHeader>
						<CardTitle>Recent Assessments</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm text-gray-600">
							<li>Stress Level – Moderate (2 days ago)</li>
							<li>Sleep Quality – Good (Last week)</li>
							<li>Anxiety Scale – Low (2 weeks ago)</li>
						</ul>
					</CardContent>
				</Card>
			</motion.div>

			{/* Upcoming Bookings */}
			<motion.div whileHover={{ scale: 1.02 }}>
				<Card>
					<CardHeader>
						<CardTitle>Upcoming Bookings</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">
							Session with <b>Dr. Meera</b> – Sept 20, 3:00 PM
						</p>
						<p className="text-sm text-gray-600">Session with <b>Dr. Raj</b> – Sept 28, 11:00 AM</p>
					</CardContent>
				</Card>
			</motion.div>

			{/* Recommended Resources */}
			<motion.div whileHover={{ scale: 1.02 }}>
				<Card>
					<CardHeader>
						<CardTitle>Recommended Resources</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm text-indigo-600 underline">
							<li>Meditation Techniques for Students</li>
							<li>Healthy Sleep Habits Guide</li>
							<li>Time Management Strategies</li>
						</ul>
					</CardContent>
				</Card>
			</motion.div>

			{/* Forum Activities */}
			<motion.div whileHover={{ scale: 1.02 }} className="md:col-span-2">
				<Card>
					<CardHeader>
						<CardTitle>Forum Activities</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">You replied to “Coping with exam stress”</p>
						<p className="text-sm text-gray-600">New post: “How do you balance study & health?”</p>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
