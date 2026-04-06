"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { LoaderPinwheel, Users, CalendarCheck, BookOpen, BrainCircuit, TrendingUp, Activity } from "lucide-react";
import { adminService, AdminStats } from "@/services/adminService";
import { toast } from "sonner";

const COLORS = ["#6366f1", "#22c55e", "#f97316"];

function StatCard({
	title,
	value,
	icon: Icon,
	color,
	subtitle,
}: {
	title: string;
	value: string | number;
	icon: any;
	color: string;
	subtitle?: string;
}) {
	return (
		<motion.div whileHover={{ scale: 1.02, y: -2 }}>
			<Card className="relative overflow-hidden">
				<CardContent className="pt-6">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm text-text-secondary font-medium">{title}</p>
							<p className="text-3xl font-bold mt-1 text-card-foreground">{value}</p>
							{subtitle && (
								<p className="text-xs text-text-secondary mt-1">{subtitle}</p>
							)}
						</div>
						<div
							className={`p-3 rounded-2xl ${color} shadow-lg`}
						>
							<Icon className="w-5 h-5 text-white" />
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export default function AdminOverview() {
	const [stats, setStats] = useState<AdminStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		adminService
			.getStats()
			.then(setStats)
			.catch((e) => {
				setError(e.message);
				toast.error("Failed to load dashboard stats");
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<LoaderPinwheel className="animate-spin w-8 h-8 text-muted-foreground" />
			</div>
		);
	}

	if (error || !stats) {
		return (
			<div className="flex h-64 items-center justify-center flex-col gap-3">
				<Activity className="w-8 h-8 text-red-400" />
				<p className="text-red-500 text-sm">Failed to load stats: {error}</p>
			</div>
		);
	}

	const userData = [
		{ name: "Students", value: stats.users.students, color: COLORS[0] },
		{ name: "Counsellors", value: stats.users.counsellors, color: COLORS[1] },
		{ name: "Admins", value: stats.users.admins, color: COLORS[2] },
	];

	const bookingData = [
		{ name: "Pending", value: stats.bookings.pending, color: "#f59e0b" },
		{ name: "Confirmed", value: stats.bookings.confirmed, color: "#22c55e" },
		{ name: "Total", value: stats.bookings.total, color: "#6366f1" },
	];

	return (
		<div className="p-4 sm:p-6 space-y-6">
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Total Users"
					value={stats.users.total}
					icon={Users}
					color="bg-indigo-500"
					subtitle={`${stats.users.students} students · ${stats.users.counsellors} counselors`}
				/>
				<StatCard
					title="Bookings This Week"
					value={stats.bookings.this_week}
					icon={CalendarCheck}
					color="bg-emerald-500"
					subtitle={`${stats.bookings.pending} pending`}
				/>
				<StatCard
					title="Resources"
					value={stats.resources}
					icon={BookOpen}
					color="bg-orange-500"
				/>
				<StatCard
					title="Assessments"
					value={stats.assessments.total}
					icon={BrainCircuit}
					color="bg-purple-500"
					subtitle={`${stats.assessments.this_week} this week`}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				{/* User Distribution */}
				<motion.div whileHover={{ scale: 1.02 }}>
					<Card>
						<CardHeader>
							<CardTitle className="text-base">User Distribution</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-52">
								<ResponsiveContainer>
									<PieChart>
										<Pie
											data={userData}
											dataKey="value"
											nameKey="name"
											cx="50%"
											cy="50%"
											innerRadius={55}
											outerRadius={80}
											paddingAngle={4}
										>
											{userData.map((_, i) => (
												<Cell key={i} fill={userData[i].color} />
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="flex justify-center gap-4 mt-2">
								{userData.map((d) => (
									<div key={d.name} className="flex items-center gap-1.5">
										<div
											className="w-2.5 h-2.5 rounded-full"
											style={{ backgroundColor: d.color }}
										/>
										<span className="text-xs text-text-secondary">{d.name}</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>

				{/* Booking Stats */}
				<motion.div whileHover={{ scale: 1.02 }}>
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Booking Overview</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-52">
								<ResponsiveContainer>
									<BarChart data={bookingData} layout="vertical">
										<XAxis type="number" hide />
										<YAxis
											type="category"
											dataKey="name"
											tick={{ fontSize: 12 }}
											width={80}
										/>
										<Tooltip
											contentStyle={{
												background: "#fff",
												border: "1px solid #e5e7eb",
												borderRadius: "1rem",
											}}
										/>
										<Bar dataKey="value" radius={[0, 8, 8, 0]}>
											{bookingData.map((entry, i) => (
												<Cell key={i} fill={entry.color} />
											))}
										</Bar>
									</BarChart>
								</ResponsiveContainer>
							</div>
							<p className="text-center text-sm text-text-secondary mt-2">
								{stats.bookings.total} total bookings
							</p>
						</CardContent>
					</Card>
				</motion.div>

				{/* Recent Activity */}
				<motion.div whileHover={{ scale: 1.02 }}>
					<Card>
						<CardHeader>
							<CardTitle className="text-base flex items-center gap-2">
								<TrendingUp className="w-4 h-4 text-indigo-500" />
								Activity (7 days)
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{[
								{
									label: "New Bookings",
									value: stats.recent_activity.bookings,
									color: "bg-indigo-500",
								},
								{
									label: "New Assessments",
									value: stats.recent_activity.assessments,
									color: "bg-purple-500",
								},
								{
									label: "Total Bookings",
									value: stats.bookings.total,
									color: "bg-emerald-500",
								},
								{
									label: "Assessments This Week",
									value: stats.assessments.this_week,
									color: "bg-orange-500",
								},
							].map((item) => (
								<div key={item.label} className="flex items-center justify-between">
									<span className="text-sm text-text-secondary">{item.label}</span>
									<div className="flex items-center gap-2">
										<div className={`w-2 h-2 rounded-full ${item.color}`} />
										<span className="text-sm font-semibold">{item.value}</span>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
