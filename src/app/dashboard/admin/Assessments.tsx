"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Brain,
	Moon,
	Heart,
	Clock,
	BarChart3,
	Star,
	LoaderPinwheel,
	TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { adminService, AssessmentStats } from "@/services/adminService";

const assessmentMeta = [
	{
		id: "phq9",
		title: "PHQ-9 Depression Scale",
		description:
			"Evaluate current stress levels and depression symptoms over the past 2 weeks",
		icon: Brain,
		color: "from-red-400 to-pink-500",
		bgColor: "bg-red-50",
		borderColor: "border-red-200",
		category: "Mental Health",
		duration: "5-7 minutes",
		questions: 9,
		difficulty: "Easy",
	},
	{
		id: "gad7",
		title: "GAD-7 Anxiety Scale",
		description:
			"Comprehensive anxiety evaluation based on clinical standards over the past 2 weeks",
		icon: Heart,
		color: "from-blue-400 to-indigo-500",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		category: "Mental Health",
		duration: "8-10 minutes",
		questions: 7,
		difficulty: "Medium",
	},
	{
		id: "psqi",
		title: "PSQI Sleep Quality Index",
		description:
			"Analyze sleep patterns and identify areas for improvement over the past month",
		icon: Moon,
		color: "from-purple-400 to-violet-500",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
		category: "Sleep Health",
		duration: "6-8 minutes",
		questions: 19,
		difficulty: "Easy",
	},
];

export default function AdminAssessments() {
	const [stats, setStats] = useState<AssessmentStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		adminService
			.getAssessmentStats()
			.then(setStats)
			.catch((e) => {
				setError(e instanceof Error ? e.message : "Failed to load assessment stats");
				toast.error("Failed to load assessment stats");
			})
			.finally(() => setLoading(false));
	}, []);

	const getCount = (id: string) => {
		if (!stats) return 0;
		const entry = stats.by_type.find((t) => t.assessment_type === id);
		return entry ? entry.count : 0;
	};

	const getAvgScore = (id: string) => {
		if (!stats?.average_scores) return null;
		return stats.average_scores[id] ?? null;
	};

	return (
		<div className="p-4 sm:p-6 space-y-6">
			{/* Stats Overview */}
			{loading ? (
				<div className="flex justify-center py-6">
					<LoaderPinwheel className="animate-spin w-6 h-6 text-muted-foreground" />
				</div>
			) : error ? (
				<p className="text-red-500 text-sm text-center">{error}</p>
			) : stats ? (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<Card>
						<CardContent className="pt-4 text-center">
							<p className="text-3xl font-bold">{stats.total_submissions}</p>
							<p className="text-xs text-text-secondary mt-1">Total Submissions</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-4 text-center">
							<p className="text-3xl font-bold">{stats.recent_submissions}</p>
							<p className="text-xs text-text-secondary mt-1">Last 30 Days</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-4 text-center">
							<p className="text-3xl font-bold">{assessmentMeta.length}</p>
							<p className="text-xs text-text-secondary mt-1">Assessment Types</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-4 flex items-center justify-center gap-2">
							<TrendingUp className="w-5 h-5 text-emerald-500" />
							<div>
								<p className="text-2xl font-bold">
									{stats.average_scores
										? Object.values(stats.average_scores)
												.reduce((a, b) => a + b, 0) /
										  Object.keys(stats.average_scores).length
										: 0}
								</p>
								<p className="text-xs text-text-secondary">Avg Score</p>
							</div>
						</CardContent>
					</Card>
				</div>
			) : null}

			{/* Assessment Cards */}
			<Card>
				<CardHeader className="pb-4">
					<CardTitle className="text-base">Assessment Overview</CardTitle>
					<CardDescription className="text-sm">
						View submission data for all health assessments. Assessments are
						managed system-wide and cannot be modified from the admin portal.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{assessmentMeta.map((assessment) => {
							const IconComponent = assessment.icon;
							const count = getCount(assessment.id);
							const avgScore = getAvgScore(assessment.id);

							return (
								<div
									key={assessment.id}
									className={`p-5 rounded-2xl border-2 ${assessment.borderColor} ${assessment.bgColor} transition-all duration-200 hover:shadow-lg`}
								>
									<div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
										{/* Icon */}
										<div
											className={`p-4 rounded-2xl bg-gradient-to-br ${assessment.color} shadow-lg shrink-0`}
										>
											<IconComponent className="w-7 h-7 text-white" />
										</div>

										{/* Content */}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 flex-wrap mb-1">
												<h3 className="text-base font-semibold text-card-foreground">
													{assessment.title}
												</h3>
												<Badge
													variant={
														assessment.category === "Mental Health"
															? "info"
															: "soft"
													}
												>
													{assessment.category}
												</Badge>
											</div>
											<p className="text-sm text-text-secondary mb-3">
												{assessment.description}
											</p>

											{/* Metrics */}
											<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
												<div className="flex items-center gap-2 p-2 rounded-xl bg-white/60">
													<div
														className={`p-1.5 rounded-lg ${
															assessment.id === "phq9"
																? "bg-red-100 text-red-600"
																: assessment.id === "gad7"
																? "bg-blue-100 text-blue-600"
																: "bg-purple-100 text-purple-600"
														}`}
													>
														<BarChart3 className="w-3.5 h-3.5" />
													</div>
													<div>
														<p className="text-sm font-bold">{count}</p>
														<p className="text-xs text-text-secondary">Responses</p>
													</div>
												</div>

												{avgScore !== null ? (
													<div className="flex items-center gap-2 p-2 rounded-xl bg-white/60">
														<div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
															<TrendingUp className="w-3.5 h-3.5" />
														</div>
														<div>
															<p className="text-sm font-bold">{avgScore}</p>
															<p className="text-xs text-text-secondary">Avg Score</p>
														</div>
													</div>
												) : null}

												<div className="flex items-center gap-2 p-2 rounded-xl bg-white/60">
													<div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
														<Clock className="w-3.5 h-3.5" />
													</div>
													<div>
														<p className="text-sm font-bold">{assessment.duration}</p>
														<p className="text-xs text-text-secondary">Duration</p>
													</div>
												</div>

												<div className="flex items-center gap-2 p-2 rounded-xl bg-white/60">
													<div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
														<Star className="w-3.5 h-3.5" />
													</div>
													<div>
														<p className="text-sm font-bold">{assessment.difficulty}</p>
														<p className="text-xs text-text-secondary">Difficulty</p>
													</div>
												</div>
											</div>
										</div>

										{/* Avg score badge */}
										{avgScore !== null && (
											<div className="shrink-0 text-center">
												<div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow">
													{avgScore.toFixed(1)}
												</div>
												<p className="text-xs text-text-secondary mt-1">
													Avg Score
												</p>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
