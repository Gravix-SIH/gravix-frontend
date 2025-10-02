"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Calendar,
	Clock,
	Video,
	MapPin,
	Phone,
	Star,
	User,
	Heart,
	Brain,
	Moon,
	CheckCircle2,
	Filter,
	Search,
	ChevronLeft,
	ChevronRight,
	Users,
	Award,
	MessageSquare
} from "lucide-react";
import { useState } from "react";

export default function StudentBooking() {
	const [selectedCounselor, setSelectedCounselor] = useState(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState(null);
	const [sessionType, setSessionType] = useState('video');
	const [currentWeek, setCurrentWeek] = useState(0);

	const counselors = [
		{
			id: 1,
			name: "Dr. Meera Sharma",
			specialty: "Stress & Anxiety Management",
			experience: "8 years",
			rating: 4.9,
			reviews: 156,
			image: "👩‍⚕️",
			languages: ["English", "Hindi"],
			education: "PhD Psychology, AIIMS",
			nextAvailable: "Today, 3:00 PM",
			sessionTypes: ["video", "in-person", "phone"],
			expertise: ["Stress Management", "Anxiety Disorders", "Student Counseling"],
			bio: "Specialized in helping students manage academic stress and anxiety disorders."
		},
		{
			id: 2,
			name: "Dr. Raj Patel",
			specialty: "Sleep & Lifestyle Therapy",
			experience: "12 years",
			rating: 4.8,
			reviews: 203,
			image: "👨‍⚕️",
			languages: ["English", "Gujarati"],
			education: "MD Psychiatry, NIMHANS",
			nextAvailable: "Tomorrow, 11:00 AM",
			sessionTypes: ["video", "in-person"],
			expertise: ["Sleep Disorders", "Lifestyle Medicine", "Behavioral Therapy"],
			bio: "Expert in sleep medicine and helping students develop healthy lifestyle habits."
		},
		{
			id: 3,
			name: "Dr. Kiran Singh",
			specialty: "Cognitive Behavioral Therapy",
			experience: "6 years",
			rating: 4.7,
			reviews: 89,
			image: "👩‍⚕️",
			languages: ["English", "Punjabi"],
			education: "M.Phil Clinical Psychology",
			nextAvailable: "Oct 1, 5:00 PM",
			sessionTypes: ["video", "phone"],
			expertise: ["CBT", "Depression", "Academic Pressure"],
			bio: "Cognitive behavioral therapy specialist focusing on academic and personal development."
		}
	];

	const timeSlots = [
		"9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
		"2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
	];

	const sessionTypes = [
		{ id: 'video', label: 'Video Call', icon: Video, description: 'Online session via secure video' },
		{ id: 'in-person', label: 'In-Person', icon: MapPin, description: 'Face-to-face at our clinic' },
		{ id: 'phone', label: 'Phone Call', icon: Phone, description: 'Traditional phone consultation' }
	];

	const getWeekDates = (weekOffset = 0) => {
		const today = new Date();
		const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (weekOffset * 7)));
		const dates = [];
		for (let i = 0; i < 7; i++) {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i);
			dates.push(date);
		}
		return dates;
	};

	const formatDate = (date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	};

	const isToday = (date) => {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	};

	const weekDates = getWeekDates(currentWeek);

	return (
		<div className="p-6 h-full max-h-[91vh] overflow-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white mb-2">Book a Session</h1>
				<p className="text-purple-100">Connect with our qualified mental health professionals</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				{/* Counselors List */}
				<div className="lg:col-span-8">
					<Card className="border-0 shadow-xl bg-white/45 backdrop-blur-sm mb-6">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-xl text-gray-800 flex items-center">
									<Users className="w-6 h-6 mr-2 text-purple-600" />
									Available Counselors
								</CardTitle>
								<div className="flex items-center space-x-3">
									<div className="relative">
										<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
										<Input placeholder="Search counselors..." className="pl-10 w-64" />
									</div>
									<Button variant="outline" size="sm">
										<Filter className="w-4 h-4 mr-1" />
										Filter
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-6">
								{counselors.map((counselor) => (
									<Card key={counselor.id}
										className={`border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${selectedCounselor?.id === counselor.id
											? 'border-purple-400 bg-purple-50'
											: 'border-gray-200 hover:border-purple-200'
											}`}
										onClick={() => setSelectedCounselor(counselor)}>
										<CardContent className="p-6">
											<div className="flex items-start space-x-6">
												{/* Profile Image */}
												<div className="text-6xl bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full p-4 shadow-lg">
													{counselor.image}
												</div>

												{/* Counselor Info */}
												<div className="flex-1">
													<div className="flex items-start justify-between mb-3">
														<div>
															<h3 className="text-xl font-bold text-gray-900 mb-1">{counselor.name}</h3>
															<p className="text-purple-600 font-medium mb-2">{counselor.specialty}</p>
															<p className="text-gray-600 text-sm mb-3">{counselor.bio}</p>
														</div>
														<Badge className="bg-green-50 text-green-700 border-green-200">
															Available
														</Badge>
													</div>

													{/* Stats Row */}
													<div className="flex items-center space-x-6 mb-4">
														<div className="flex items-center text-sm text-gray-600">
															<Award className="w-4 h-4 mr-1" />
															{counselor.experience} experience
														</div>
														<div className="flex items-center text-sm text-gray-600">
															<Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
															{counselor.rating} ({counselor.reviews} reviews)
														</div>
														<div className="flex items-center text-sm text-gray-600">
															<MessageSquare className="w-4 h-4 mr-1" />
															{counselor.languages.join(", ")}
														</div>
													</div>

													{/* Expertise Tags */}
													<div className="flex flex-wrap gap-2 mb-4">
														{counselor.expertise.map((skill, index) => (
															<Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
																{skill}
															</Badge>
														))}
													</div>

													{/* Session Types and Next Available */}
													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-3">
															{counselor.sessionTypes.map((type) => {
																const IconComponent = sessionTypes.find(st => st.id === type)?.icon || Video;
																return (
																	<div key={type} className="flex items-center text-xs text-gray-500">
																		<IconComponent className="w-3 h-3 mr-1" />
																		{sessionTypes.find(st => st.id === type)?.label}
																	</div>
																);
															})}
														</div>
														<div className="flex items-center text-sm">
															<Clock className="w-4 h-4 mr-1 text-green-500" />
															<span className="text-green-600 font-medium">Next: {counselor.nextAvailable}</span>
														</div>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Booking Sidebar */}
				<div className="lg:col-span-4 space-y-6">
					{/* Session Type Selection */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-lg text-gray-800">Session Type</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{sessionTypes.map((type) => {
								const IconComponent = type.icon;
								return (
									<div key={type.id}
										className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${sessionType === type.id
											? 'border-purple-400 bg-purple-50'
											: 'border-gray-200 hover:border-purple-200'
											}`}
										onClick={() => setSessionType(type.id)}>
										<div className="flex items-start space-x-3">
											<IconComponent className="w-5 h-5 text-purple-600 mt-0.5" />
											<div>
												<h4 className="font-medium text-gray-900">{type.label}</h4>
												<p className="text-sm text-gray-600">{type.description}</p>
											</div>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>

					{/* Calendar */}
					<Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg text-gray-800">Select Date</CardTitle>
								<div className="flex items-center space-x-2">
									<Button variant="outline" size="sm"
										onClick={() => setCurrentWeek(currentWeek - 1)}>
										<ChevronLeft className="w-4 h-4 text-black" />
									</Button>
									<Button variant="outline" size="sm"
										onClick={() => setCurrentWeek(currentWeek + 1)}>
										<ChevronRight className="w-4 h-4 text-black" />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-7 gap-2">
								{weekDates.map((date, index) => (
									<div key={index}
										className={`p-3 text-center rounded-lg cursor-pointer transition-all text-sm ${selectedDate.toDateString() === date.toDateString()
											? 'bg-purple-500 text-white'
											: isToday(date)
												? 'bg-purple-100 text-purple-800 font-medium'
												: 'hover:bg-gray-100 text-gray-700'
											}`}
										onClick={() => setSelectedDate(date)}>
										<div className="font-medium">{date.getDate()}</div>
										<div className="text-xs opacity-75">
											{date.toLocaleDateString('en-US', { weekday: 'short' })}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Time Slots */}
					<Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-lg text-gray-800">Available Times</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-2">
								{timeSlots.map((time) => (
									<Button key={time}
										variant={selectedTime === time ? "default" : "outline"}
										size="sm"
										className={selectedTime === time ? "bg-purple-500 hover:bg-purple-600" : "text-gray-700"}
										onClick={() => setSelectedTime(time)}>
										{time}
									</Button>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Booking Summary */}
					{selectedCounselor && selectedTime && (
						<Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
							<CardHeader>
								<CardTitle className="text-lg text-white">Booking Summary</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex items-center justify-between">
									<span>Counselor:</span>
									<span className="font-medium">{selectedCounselor.name}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Date:</span>
									<span className="font-medium">{formatDate(selectedDate)}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Time:</span>
									<span className="font-medium">{selectedTime}</span>
								</div>
								<div className="flex items-center justify-between">
									<span>Session Type:</span>
									<span className="font-medium capitalize">{sessionType.replace('-', ' ')}</span>
								</div>
								<Button className="w-full mt-4 bg-white text-purple-600 hover:bg-gray-50">
									<CheckCircle2 className="w-4 h-4 mr-2" />
									Confirm Booking
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}