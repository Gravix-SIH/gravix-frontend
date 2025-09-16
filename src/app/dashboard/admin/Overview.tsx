"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const userData = [
	{ name: "Students", value: 240 },
	{ name: "Counsellors", value: 12 },
	{ name: "Admins", value: 3 },
];
const COLORS = ["#6366f1", "#22c55e", "#f97316"];

export default function AdminOverview() {
	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{/* Total Users */}
			<motion.div whileHover={{ scale: 1.02 }}>
				<Card>
					<CardHeader>
						<CardTitle>User Distribution</CardTitle>
					</CardHeader>
					<CardContent className="h-60">
						<ResponsiveContainer>
							<PieChart>
								<Pie
									data={userData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={80}
									label
								>
									{userData.map((entry, i) => (
										<Cell key={i} fill={COLORS[i % COLORS.length]} />
									))}
								</Pie>
							</PieChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</motion.div>

			{/* System Metrics */}
			<motion.div whileHover={{ scale: 1.02 }}>
				<Card>
					<CardHeader>
						<CardTitle>System Metrics</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-gray-600">Active Users Today: <b>120</b></p>
						<p className="text-sm text-gray-600">Sessions Booked This Week: <b>42</b></p>
						<p className="text-sm text-gray-600">Assessments Taken: <b>87</b></p>
					</CardContent>
				</Card>
			</motion.div>

			{/* Alerts */}
			<motion.div whileHover={{ scale: 1.02 }}>
				<Card>
					<CardHeader>
						<CardTitle>System Alerts</CardTitle>
					</CardHeader>
					<CardContent className="text-sm text-red-600">
						- Counsellor availability low next week.
						- New update pending approval.
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
