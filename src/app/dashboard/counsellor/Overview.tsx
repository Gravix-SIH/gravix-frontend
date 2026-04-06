"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
	CalendarCheck,
	Users,
	ClipboardCheck,
	TrendingUp,
	LoaderPinwheel,
	Activity,
} from "lucide-react";
import { counselorService, CounselorStats } from "@/services/CounselorService";
import { toast } from "sonner";

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
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-start justify-between">
						<div>
							<p className="text-sm text-text-secondary font-medium">{title}</p>
							<p className="text-3xl font-bold mt-1 text-card-foreground">{value}</p>
							{subtitle && (
								<p className="text-xs text-text-secondary mt-1">{subtitle}</p>
							)}
						</div>
						<div className={`p-3 rounded-2xl ${color} shadow-lg`}>
							<Icon className="w-5 h-5 text-white" />
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export default function CounselorOverview() {
	const [stats, setStats] = useState<CounselorStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		counselorService
			.getStats()
			.then(setStats)
			.catch((e) => {
				setError(e.message);
				toast.error("Failed to load dashboard");
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
				<p className="text-red-500 text-sm">{error || "Failed to load stats"}</p>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6 space-y-6">
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Upcoming Sessions"
					value={stats.upcoming_sessions}
					icon={CalendarCheck}
					color="bg-indigo-500"
				/>
				<StatCard
					title="Completed Sessions"
					value={stats.completed_sessions}
					icon={Users}
					color="bg-emerald-500"
					subtitle={`${stats.students_seen} unique students`}
				/>
				<StatCard
					title="Assessments to Review"
					value={stats.assessments_to_review}
					icon={ClipboardCheck}
					color="bg-amber-500"
				/>
				<StatCard
					title="Recent Submissions"
					value={stats.recent_submissions}
					icon={TrendingUp}
					color="bg-purple-500"
					subtitle="Last 30 days"
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<motion.div whileHover={{ scale: 1.02 }}>
					<Card>
						<CardHeader>
							<CardTitle className="text-base flex items-center gap-2">
								<CalendarCheck className="w-4 h-4 text-indigo-500" />
								Session Summary
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{[
								{
									label: "Upcoming Sessions",
									value: stats.upcoming_sessions,
									color: "bg-indigo-500",
								},
								{
									label: "Completed Sessions",
									value: stats.completed_sessions,
									color: "bg-emerald-500",
								},
								{
									label: "Unique Students",
									value: stats.students_seen,
									color: "bg-amber-500",
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

				<motion.div whileHover={{ scale: 1.02 }}>
					<Card>
						<CardHeader>
							<CardTitle className="text-base flex items-center gap-2">
								<ClipboardCheck className="w-4 h-4 text-purple-500" />
								Assessment Activity
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{[
								{
									label: "Total Assessments to Review",
									value: stats.assessments_to_review,
									color: "bg-purple-500",
								},
								{
									label: "Submissions (Last 30 Days)",
									value: stats.recent_submissions,
									color: "bg-emerald-500",
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
