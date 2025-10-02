"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Brain,
	Moon,
	Heart,
	Clock,
	TrendingUp,
	Calendar,
	Star,
	Play,
	CheckCircle2,
	AlertCircle,
	Target,
	Activity,
	BarChart3,
	Timer,
	Award,
	Zap
} from "lucide-react";
import { useState } from "react";

export default function StudentAssessment() {
	const [selectedAssessment, setSelectedAssessment] = useState(null);

	const assessments = [
		{
			id: 1,
			title: "Stress Level Test (PHQ-9)",
			description: "Evaluate your current stress levels and get personalized recommendations",
			icon: Brain,
			duration: "5-7 minutes",
			questions: 9,
			difficulty: "Easy",
			lastTaken: "2 days ago",
			lastScore: 20,
			trend: "stable",
			color: "from-red-400 to-pink-500",
			bgColor: "bg-red-50",
			borderColor: "border-red-200",
			textColor: "text-red-700",
			category: "Mental Health"
		},
		{
			id: 2,
			title: "Anxiety Scale Assessment (GAD-7)",
			description: "Comprehensive anxiety evaluation based on clinical standards",
			icon: Heart,
			duration: "8-10 minutes",
			questions: 7,
			difficulty: "Medium",
			lastTaken: "2 weeks ago",
			lastScore: 13,
			trend: "down",
			color: "from-blue-400 to-indigo-500",
			bgColor: "bg-blue-50",
			borderColor: "border-blue-200",
			textColor: "text-blue-700",
			category: "Mental Health"
		},
		{
			id: 3,
			title: "Sleep Quality Survey (PSQI)",
			description: "Analyze your sleep patterns and identify improvement areas",
			icon: Moon,
			duration: "6-8 minutes",
			questions: 19,
			difficulty: "Easy",
			lastTaken: "1 week ago",
			lastScore: 35,
			trend: "up",
			color: "from-purple-400 to-violet-500",
			bgColor: "bg-purple-50",
			borderColor: "border-purple-200",
			textColor: "text-purple-700",
			category: "Sleep Health"
		}
	];

	const recentResults = [
		{ assessment: "Stress Level", score: 6, date: "Sept 15", status: "moderate", change: "+0.3" },
		{ assessment: "Sleep Quality", score: 5, date: "Sept 12", status: "good", change: "+1.2" },
		{ assessment: "Anxiety Scale", score: 7, date: "Sept 5", status: "low", change: "-0.8" }
	];

	const getTrendIcon = (trend) => {
		if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
		if (trend === 'down') return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
		return <div className="w-4 h-1 bg-gray-400 rounded" />;
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'good': return 'text-green-600 bg-green-50 border-green-200';
			case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
			case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
			default: return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	};

	return (
		<div className="p-6 h-full max-h-[91vh] overflow-auto">
			{/* Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold text-white mb-2">Health Assessments</h1>
						<p className="text-purple-100">Track your wellness journey with personalized assessments</p>
					</div>
					<div className="flex items-center space-x-3">
						<Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
							<Activity className="w-3 h-3 mr-1" />
							3 Available
						</Badge>
					</div>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm text-white">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-purple-100 text-sm">Assessments Completed</p>
									<p className="text-2xl font-bold">12</p>
								</div>
								<CheckCircle2 className="w-8 h-8 text-green-400" />
							</div>
						</CardContent>
					</Card>
					<Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm text-white">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-purple-100 text-sm">Overall Wellness Score</p>
									<p className="text-2xl font-bold">8.2</p>
								</div>
								<Award className="w-8 h-8 text-yellow-400" />
							</div>
						</CardContent>
					</Card>
					<Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm text-white">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-purple-100 text-sm">Improvement Streak</p>
									<p className="text-2xl font-bold">7 days</p>
								</div>
								<Zap className="w-8 h-8 text-orange-400" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				{/* Main Assessment Cards */}
				<div className="lg:col-span-8">
					<div className="space-y-6">
						<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
							<CardHeader>
								<CardTitle className="text-xl text-gray-800 flex items-center">
									<Target className="w-6 h-6 mr-2 text-purple-600" />
									Available Assessments
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-6">
									{assessments.map((assessment, index) => {
										const IconComponent = assessment.icon;
										return (
											<div key={assessment.id} className="group">
												<Card className={`border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer ${assessment.borderColor} ${assessment.bgColor} hover:border-opacity-60`}>
													<CardContent className="p-6">
														<div className="flex items-start justify-between">
															<div className="flex items-start space-x-4 flex-1">
																<div className={`p-3 rounded-xl bg-gradient-to-r ${assessment.color} shadow-lg`}>
																	<IconComponent className="w-6 h-6 text-white" />
																</div>

																<div className="flex-1">
																	<div className="flex items-center space-x-3 mb-2">
																		<h3 className="text-xl font-semibold text-gray-900">{assessment.title}</h3>
																		<Badge variant="outline" className={`text-xs ${assessment.textColor} bg-white/70`}>
																			{assessment.category}
																		</Badge>
																	</div>

																	<p className="text-gray-600 mb-4 leading-relaxed">{assessment.description}</p>

																	<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
																		<div className="flex items-center text-sm text-gray-500">
																			<Timer className="w-4 h-4 mr-2" />
																			{assessment.duration}
																		</div>
																		<div className="flex items-center text-sm text-gray-500">
																			<BarChart3 className="w-4 h-4 mr-2" />
																			{assessment.questions} questions
																		</div>
																		<div className="flex items-center text-sm text-gray-500">
																			<Star className="w-4 h-4 mr-2" />
																			{assessment.difficulty}
																		</div>
																		<div className="flex items-center text-sm text-gray-500">
																			<Calendar className="w-4 h-4 mr-2" />
																			{assessment.lastTaken}
																		</div>
																	</div>

																	{assessment.lastScore && (
																		<div className="flex items-center space-x-4 mb-4">
																			<div className="flex items-center space-x-2">
																				<span className="text-sm text-gray-600">Last Score:</span>
																				<span className="font-bold text-lg text-gray-800">{assessment.lastScore}/{ assessment.questions * 3}</span>
																				{getTrendIcon(assessment.trend)}
																			</div>
																			<Progress value={(assessment.lastScore / (assessment.questions * 3)) * 100} className="flex-1 max-w-32" />
																		</div>
																	)}
																</div>
															</div>

															<Button
																className={`ml-4 bg-gradient-to-r ${assessment.color} hover:scale-105 transition-all duration-200 text-white shadow-lg`}
																onClick={() => setSelectedAssessment(assessment.id)}
															>
																<Play className="w-4 h-4 mr-2" />
																Start Assessment
															</Button>
														</div>
													</CardContent>
												</Card>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Sidebar */}
				<div className="lg:col-span-4 space-y-6">
					{/* Recent Results */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-lg text-gray-800 flex items-center">
								<BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
								Recent Results
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentResults.map((result, index) => (
									<div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
										<div className="flex items-center justify-between mb-2">
											<h4 className="font-medium text-gray-900 text-sm">{result.assessment}</h4>
											<Badge className={`text-xs border ${getStatusColor(result.status)}`}>
												{result.status}
											</Badge>
										</div>
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-3">
												<span className="text-2xl font-bold text-gray-800">{result.score}</span>
												<div className="text-sm text-gray-500">
													<p>{result.date}</p>
													<p className="text-xs">{result.change} from last</p>
												</div>
											</div>
											<Progress value={result.score * 10} className="w-16" />
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
						<CardHeader>
							<CardTitle className="text-lg text-white">Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
								<Calendar className="w-4 h-4 mr-2" />
								Schedule Assessment
							</Button>
							<Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
								<BarChart3 className="w-4 h-4 mr-2" />
								View Progress Report
							</Button>
							<Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
								<Target className="w-4 h-4 mr-2" />
								Set Wellness Goals
							</Button>
						</CardContent>
					</Card>

					{/* Tips */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-lg text-gray-800 flex items-center">
								<AlertCircle className="w-5 h-5 mr-2 text-amber-600" />
								Assessment Tips
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3 text-sm text-gray-600">
								<div className="flex items-start space-x-3">
									<CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
									<p>Take assessments in a quiet, comfortable environment</p>
								</div>
								<div className="flex items-start space-x-3">
									<CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
									<p>Answer honestly for the most accurate results</p>
								</div>
								<div className="flex items-start space-x-3">
									<CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
									<p>Regular assessments help track your progress</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}