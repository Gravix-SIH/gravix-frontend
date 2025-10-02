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
	MessageCircle,
	TrendingUp,
	Clock,
	Activity,
	Users,
	Target,
	AlertCircle,
	CheckCircle2,
	ArrowRight,
	Plus,
	Star,
	Zap
} from "lucide-react";

export default function StudentOverviewsetShowSection({setShowSection}: {setShowSection: (section: string) => void}) {
	const healthMetrics = [
		{ icon: Brain, label: "Stress Level", value: "Moderate", color: "bg-yellow-500", trend: "stable", date: "2 days ago" },
		{ icon: Moon, label: "Sleep Quality", value: "Good", color: "bg-green-500", trend: "up", date: "Last week" },
		{ icon: Heart, label: "Anxiety Scale", value: "Low", color: "bg-blue-500", trend: "down", date: "2 weeks ago" }
	];

	const upcomingBookings = [
		{ doctor: "Dr. Meera", specialty: "Stress Management", date: "Sept 20", time: "3:00 PM", type: "Video Call" },
		{ doctor: "Dr. Raj", specialty: "Sleep Therapy", date: "Sept 28", time: "11:00 AM", type: "In-Person" }
	];

	const resources = [
		{ title: "Meditation Techniques for Students", category: "Mindfulness", duration: "15 min", rating: 4.8 },
		{ title: "Healthy Sleep Habits Guide", category: "Sleep Health", duration: "10 min", rating: 4.9 },
		{ title: "Time Management Strategies", category: "Productivity", duration: "20 min", rating: 4.7 }
	];

	const forumActivities = [
		{ action: "replied", topic: "Coping with exam stress", replies: 12, time: "2h ago" },
		{ action: "posted", topic: "How do you balance study & health?", replies: 8, time: "1d ago" }
	];

	return (
		<div className="h-full max-h-[91vh] p-6 overflow-auto">
			{/* Welcome Header */}
			<div className="mb-8">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h1 className="text-3xl font-bold text-white mb-2">Welcome back! 👋</h1>
						<p className="text-purple-100">Here's your health and wellness overview for today</p>
					</div>
					<div className="flex items-center space-x-3">
						<Badge variant="outline" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
							<CheckCircle2 className="w-3 h-3 mr-1" />
							All systems healthy
						</Badge>
					</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				{/* Left Column - Main Content */}
				<div className="lg:col-span-8 space-y-6">

					{/* Health Metrics */}
					<Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
						<CardHeader className="pb-4">
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center text-xl">
									<Activity className="w-6 h-6 mr-2 text-purple-600" />
									Recent Health Assessments
								</CardTitle>
								<Button variant="outline" size="sm" className="text-black border-white/30 bg-black/5 hover:bg-white/20 backdrop-blur-sm">
									<Plus className="w-4 h-4 mr-1" />
									New Assessment
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-3">
								{healthMetrics.map((metric, index) => {
									const IconComponent = metric.icon;
									return (
										<div key={index} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all cursor-pointer">
											<div className="flex items-start justify-between mb-3">
												<div className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}>
													<IconComponent className={`w-5 h-5 text-${metric.color.replace('bg-', '').replace('-500', '-600')}`} />
												</div>
												<div className="flex items-center">
													{metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
													{metric.trend === 'down' && <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />}
													{metric.trend === 'stable' && <div className="w-4 h-1 bg-gray-300 rounded" />}
												</div>
											</div>
											<h3 className="font-semibold text-gray-900 mb-1">{metric.label}</h3>
											<p className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</p>
											<p className="text-xs text-gray-500">{metric.date}</p>
										</div>
									);
								})}
							</div>

							<div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-semibold text-purple-900 mb-1">Weekly Health Score</h4>
										<div className="flex items-center">
											<span className="text-3xl font-bold text-purple-700 mr-2">82</span>
											<Badge className="bg-purple-100 text-purple-700">+5 from last week</Badge>
										</div>
									</div>
									<div className="text-right">
										<Zap className="w-8 h-8 text-purple-500 mb-2" />
										<p className="text-sm text-purple-600">Great progress!</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Forum Activities */}
					<Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center text-xl">
								<MessageCircle className="w-6 h-6 mr-2 text-indigo-600" />
								Community Forum Activities
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{forumActivities.map((activity, index) => (
									<div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all cursor-pointer">
										<div className="p-2 bg-indigo-100 rounded-full">
											<Users className="w-4 h-4 text-indigo-600" />
										</div>
										<div className="flex-1">
											<p className="text-gray-900">
												You <span className="font-semibold text-indigo-600">{activity.action}</span> to "
												<span className="font-medium">{activity.topic}</span>"
											</p>
											<div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
												<span className="flex items-center">
													<MessageCircle className="w-3 h-3 mr-1" />
													{activity.replies} replies
												</span>
												<span className="flex items-center">
													<Clock className="w-3 h-3 mr-1" />
													{activity.time}
												</span>
											</div>
										</div>
										<ArrowRight className="w-5 h-5 text-gray-400" />
									</div>
								))}
							</div>

							<Button className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white" onClick={() => setShowSection("forum")}>
								<MessageCircle className="w-4 h-4 mr-2" />
								Join Community Discussions
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Sidebar */}
				<div className="lg:col-span-4 space-y-6">

					{/* Upcoming Appointments */}
					<Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center text-lg">
								<Calendar className="w-5 h-5 mr-2 text-green-600" />
								Upcoming Sessions
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{upcomingBookings.map((booking, index) => (
									<div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
										<div className="flex items-start justify-between mb-3">
											<div>
												<h4 className="font-semibold text-gray-900">{booking.doctor}</h4>
												<p className="text-sm text-gray-600">{booking.specialty}</p>
											</div>
											<Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
												{booking.type}
											</Badge>
										</div>
										<div className="flex items-center text-sm text-gray-700">
											<Calendar className="w-4 h-4 mr-2" />
											<span className="font-medium">{booking.date}</span>
											<span className="mx-2">•</span>
											<Clock className="w-4 h-4 mr-1" />
											<span>{booking.time}</span>
										</div>
									</div>
								))}
							</div>

							<Button variant="outline" className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50">
								<Plus className="w-4 h-4 mr-2" onClick={() => setShowSection("booking")} />
								Book New Session
							</Button>
						</CardContent>
					</Card>

					{/* Recommended Resources */}
					<Card className="border-0 shadow-xl bg-white/10 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center text-lg">
								<BookOpen className="w-5 h-5 mr-2 text-amber-600" />
								Recommended for You
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{resources.map((resource, index) => (
									<div key={index} className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg hover:shadow-md transition-all cursor-pointer border border-amber-100">
										<h4 className="font-medium text-gray-900 mb-2 leading-snug">{resource.title}</h4>
										<div className="flex items-center justify-between text-xs">
											<div className="flex items-center space-x-3 text-gray-500">
												<Badge variant="outline" className="text-xs text-gray-400 border-gray-300">
													{resource.category}
												</Badge>
												<span className="flex items-center">
													<Clock className="w-3 h-3 mr-1" />
													{resource.duration}
												</span>
											</div>
											<div className="flex items-center text-amber-600">
												<Star className="w-3 h-3 mr-1 fill-current" />
												<span className="font-medium">{resource.rating}</span>
											</div>
										</div>
									</div>
								))}
							</div>

							<Button variant="outline" className="w-full mt-4 border-amber-200 text-amber-700 hover:bg-amber-50">
								<Target className="w-4 h-4 mr-2" />
								View All Resources
							</Button>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
						<CardHeader>
							<CardTitle className="text-lg text-white">Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
								<Brain className="w-4 h-4 mr-2" onClick={() => setShowSection("assessment")} />
								Take Mood Assessment
							</Button>
							<Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
								<MessageCircle className="w-4 h-4 mr-2" onClick={() => setShowSection("chat")} />
								Start AI Chat Session
							</Button>
							<Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
								<Calendar className="w-4 h-4 mr-2" onClick={() => setShowSection("booking")} />
								Schedule Check-in
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}