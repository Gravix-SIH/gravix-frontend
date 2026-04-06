"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Brain,
	Moon,
	Heart,
	Calendar,
	BookOpen,
	TrendingUp,
	Clock,
	Activity,
	Target,
	CheckCircle2,
	Plus,
	Star,
	Zap,
	Loader2,
	AlertCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { studentService, assessmentService, BookingResponse, ResourceResponse, AssessmentResultResponse } from "@/services/studentService";
import { useAuth } from "@/hooks/useAuth";

const ASSESSMENT_LABELS: Record<string, { label: string; icon: any; color: string }> = {
	phq9: { label: "Stress Level", icon: Brain, color: "bg-yellow-500" },
	gad7: { label: "Anxiety Scale", icon: Heart, color: "bg-blue-500" },
	psqi: { label: "Sleep Quality", icon: Moon, color: "bg-green-500" }
};

const ASSESSMENT_IDS = ["phq9", "gad7", "psqi"];

function getTrendFromScore(score: number, maxScore: number): "up" | "down" | "stable" {
	const percentage = (score / maxScore) * 100;
	if (percentage < 25) return "up";
	if (percentage > 50) return "down";
	return "stable";
}

function getMetricValue(score: number, assessmentId: string): string {
	if (assessmentId === "phq9") {
		if (score <= 4) return "Minimal";
		if (score <= 9) return "Mild";
		if (score <= 14) return "Moderate";
		if (score <= 19) return "Moderately Severe";
		return "Severe";
	}
	if (assessmentId === "gad7") {
		if (score <= 4) return "Minimal";
		if (score <= 9) return "Mild";
		if (score <= 14) return "Moderate";
		return "Severe";
	}
	if (assessmentId === "psqi") {
		if (score <= 5) return "Good";
		if (score <= 10) return "Fair";
		if (score <= 15) return "Poor";
		return "Very Poor";
	}
	return "Unknown";
}

export default function StudentOverview({ setShowSection }: { setShowSection: (section: string) => void }) {
	const { user } = useAuth();

	const [upcomingBookings, setUpcomingBookings] = useState<BookingResponse[]>([]);
	const [bookmarkedResources, setBookmarkedResources] = useState<ResourceResponse[]>([]);
	const [weeklyScore, setWeeklyScore] = useState<{ score: number; change: number } | null>(null);
	const [assessmentResults, setAssessmentResults] = useState<AssessmentResultResponse[]>([]);
	const [loadingBookings, setLoadingBookings] = useState(true);
	const [loadingResources, setLoadingResources] = useState(true);
	const [loadingScore, setLoadingScore] = useState(true);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		setLoadingBookings(true);
		setLoadingResources(true);
		setLoadingScore(true);

		const [bookings, resources, score, assessments] = await Promise.all([
			studentService.getUpcomingBookings(),
			studentService.getResources(),
			studentService.getWeeklyHealthScore(),
			assessmentService.getAssessments()
		]);

		setUpcomingBookings(bookings);
		setBookmarkedResources(resources.filter((r: ResourceResponse) => r.category === 'bookmarked').slice(0, 3));
		setAssessmentResults(assessments);
		setLoadingResources(false);
		setLoadingBookings(false);

		if (score) {
			setWeeklyScore(score);
		}
		setLoadingScore(false);
	};

	// Filter bookmarked resources (first 3)
	const displayResources = bookmarkedResources.slice(0, 3);

	const healthMetrics = ASSESSMENT_IDS.map(id => {
		const info = ASSESSMENT_LABELS[id];
		const result = assessmentResults.find(r => r.assessment_type === id);
		return {
			icon: info.icon,
			label: info.label,
			value: result ? getMetricValue(result.score, id) : "Not Taken",
			color: info.color,
			trend: result ? getTrendFromScore(result.score, result.max_score) : "stable" as "up" | "down" | "stable",
			date: result ? new Date(result.created_at).toLocaleDateString() : "Not assessed"
		};
	});

	return (
		<div className="h-full p-4 sm:p-6">
			{/* Welcome Header */}
			<div className="mb-6 sm:mb-8">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ""}! 👋</h1>
						<p className="text-purple-700">Here's your health and wellness overview for today</p>
					</div>
					<div className="flex items-center">
						<Badge variant="success-soft">
							<CheckCircle2 className="w-3 h-3 mr-1" />
							All systems healthy
						</Badge>
					</div>
				</div>
			</div>

			<div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
				{/* Left Column - Main Content */}
				<div className="lg:col-span-8 space-y-4 sm:space-y-6">

					{/* Health Metrics */}
					<Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
						<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
								<CardTitle className="flex items-center text-lg sm:text-xl">
									<Activity className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" />
									Recent Health Assessments
								</CardTitle>
								<Button variant="outline" size="sm" className="text-black border-white/30 bg-black/5 hover:bg-white/20 backdrop-blur-sm" onClick={() => setShowSection("assessment")}>
									<Plus className="w-4 h-4 mr-1" />
									New Assessment
								</Button>
							</div>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							<div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
								{healthMetrics.map((metric, index) => {
									const IconComponent = metric.icon;
									return (
										<div key={index} className="bg-gradient-to-br from-white to-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all cursor-pointer">
											<div className="flex items-start justify-between mb-2 sm:mb-3">
												<div className={`p-1.5 sm:p-2 rounded-lg ${metric.color} bg-opacity-10`}>
													<IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 text-${metric.color.replace('bg-', '').replace('-500', '-600')}`} />
												</div>
												<div className="flex items-center">
													{metric.trend === 'up' && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />}
													{metric.trend === 'down' && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 rotate-180" />}
													{metric.trend === 'stable' && <div className="w-3 h-1 sm:w-4 sm:h-1 bg-gray-300 rounded" />}
												</div>
											</div>
											<h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{metric.label}</h3>
											<p className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{metric.value}</p>
											<p className="text-xs text-text-secondary">{metric.date}</p>
										</div>
									);
								})}
							</div>

							<div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
									<div>
										<h4 className="font-semibold text-purple-900 mb-1">Weekly Health Score</h4>
										{loadingScore ? (
											<div className="flex items-center">
												<Loader2 className="w-5 h-5 animate-spin text-purple-500 mr-2" />
												<span className="text-sm text-purple-600">Loading...</span>
											</div>
										) : weeklyScore ? (
											<div className="flex items-center">
												<span className="text-2xl sm:text-3xl font-bold text-purple-700 mr-2">{weeklyScore.score}</span>
												<Badge variant="soft">
													{weeklyScore.change >= 0 ? "+" : ""}{weeklyScore.change} from last week
												</Badge>
											</div>
										) : (
											<div className="flex items-center">
												<span className="text-2xl sm:text-3xl font-bold text-purple-700 mr-2">--</span>
												<Badge variant="secondary">No data yet</Badge>
											</div>
										)}
									</div>
									<div className="text-right">
										<Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mb-1 sm:mb-2" />
										{weeklyScore && weeklyScore.change >= 0 ? (
											<p className="text-sm text-purple-600">Great progress!</p>
										) : weeklyScore ? (
											<p className="text-sm text-purple-600">Keep going!</p>
										) : (
											<p className="text-sm text-purple-600">Complete assessments</p>
										)}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Recommended Resources */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
							<CardTitle className="flex items-center text-base sm:text-lg text-gray-900">
								<BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-amber-600" />
								Bookmarked Resources
							</CardTitle>
						</CardHeader>
						<CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
							{loadingResources ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="w-6 h-6 animate-spin text-amber-500" />
								</div>
							) : displayResources.length > 0 ? (
								<div className="space-y-2 sm:space-y-3">
									{displayResources.map((resource) => (
										<div key={resource.id} className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg hover:shadow-md transition-all cursor-pointer border border-amber-100">
											<h4 className="font-medium text-gray-900 mb-2 leading-snug text-sm sm:text-base">{resource.title}</h4>
											<div className="flex flex-wrap items-center justify-between gap-2 text-xs">
												<div className="flex items-center space-x-3 text-text-secondary">
													<Badge variant="secondary">
														{resource.category}
													</Badge>
													{resource.duration && (
														<span className="flex items-center">
															<Clock className="w-3 h-3 mr-1" />
															{resource.duration}
														</span>
													)}
												</div>
												{resource.rating && (
													<div className="flex items-center text-amber-600">
														<Star className="w-3 h-3 mr-1 fill-current" />
														<span className="font-medium">{resource.rating}</span>
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-6">
									<BookOpen className="w-8 h-8 text-text-secondary/50 mx-auto mb-2" />
									<p className="text-sm text-text-secondary">No bookmarked resources yet</p>
								</div>
							)}

							<Button variant="outline" className="w-full mt-4 border-amber-200 text-amber-700 hover:bg-amber-50" onClick={() => setShowSection("resources")}>
								<Target className="w-4 h-4 mr-2" />
								View All Resources
							</Button>
						</CardContent>
					</Card>

				</div>

				{/* Right Column - Sidebar */}
				<div className="lg:col-span-4 space-y-4 sm:space-y-6">

					{/* Upcoming Appointments */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
							<CardTitle className="flex items-center text-base sm:text-lg text-gray-900">
								<Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
								Upcoming Sessions
							</CardTitle>
						</CardHeader>
						<CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
							{loadingBookings ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="w-6 h-6 animate-spin text-green-500" />
								</div>
							) : upcomingBookings.length > 0 ? (
								<div className="space-y-3 sm:space-y-4">
									{upcomingBookings.map((booking) => (
										<div key={booking.id} className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
											<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2 sm:mb-3">
												<div>
													<h4 className="font-semibold text-gray-900 text-sm sm:text-base">{booking.counsellor_name}</h4>
													<p className="text-xs sm:text-sm text-text-secondary">{booking.counsellor_specialty}</p>
												</div>
												<Badge variant="success-soft">
													{booking.session_type === "video" ? "Video Call" : booking.session_type === "in-person" ? "In-Person" : "Phone"}
												</Badge>
											</div>
											<div className="flex flex-wrap items-center text-xs sm:text-sm text-gray-700">
												<Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
												<span className="font-medium">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
												<span className="mx-1 sm:mx-2">•</span>
												<Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
												<span>{booking.time}</span>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-6">
									<Calendar className="w-8 h-8 text-text-secondary/50 mx-auto mb-2" />
									<p className="text-sm text-text-secondary">No upcoming sessions</p>
								</div>
							)}

							<Button variant="outline" className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50" onClick={() => setShowSection("booking")}>
								<Plus className="w-4 h-4 mr-2" />
								Book New Session
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}