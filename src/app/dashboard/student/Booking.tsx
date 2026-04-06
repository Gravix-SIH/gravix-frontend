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
	Award,
	CheckCircle2,
	Filter,
	Search,
	ChevronLeft,
	ChevronRight,
	Users,
	MessageSquare,
	Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { studentService, CounselorResponse } from "@/services/studentService";

const sessionTypes = [
	{ id: 'video', label: 'Video Call', icon: Video, description: 'Online session via secure video' },
	{ id: 'in-person', label: 'In-Person', icon: MapPin, description: 'Face-to-face at our clinic' },
	{ id: 'phone', label: 'Phone Call', icon: Phone, description: 'Traditional phone consultation' }
];

const timeSlots = [
	"9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
	"2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
];

export default function StudentBooking() {
	const [counselors, setCounselors] = useState<CounselorResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedCounselor, setSelectedCounselor] = useState<CounselorResponse | null>(null);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [sessionType, setSessionType] = useState('video');
	const [currentWeek, setCurrentWeek] = useState(0);
	const [booking, setBooking] = useState(false);

	useEffect(() => {
		loadCounselors();
	}, []);

	const loadCounselors = async () => {
		setLoading(true);
		const data = await studentService.getCounselors();
		setCounselors(data);
		setLoading(false);
	};

	const handleBookSession = async () => {
		if (!selectedCounselor || !selectedTime) return;

		setBooking(true);
		try {
			await studentService.bookSession({
				counsellor_id: selectedCounselor.id,
				date: selectedDate.toISOString().split('T')[0],
				time: selectedTime,
				session_type: sessionType as 'video' | 'in-person' | 'phone'
			});
			// Refresh bookings after successful booking
			setSelectedCounselor(null);
			setSelectedTime(null);
		} catch (error) {
			console.error('Booking failed:', error);
		} finally {
			setBooking(false);
		}
	};

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

	const formatDate = (date: Date) => {
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	};

	const isToday = (date: Date) => {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	};

	const weekDates = getWeekDates(currentWeek);

	return (
		<div className="p-4 sm:p-6 h-full">
			{/* Header */}
			<div className="mb-6 sm:mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Book a Session</h1>
				<p className="text-purple-700 text-sm sm:text-base">Connect with our qualified mental health professionals</p>
			</div>

			<div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
				{/* Counselors List */}
				<div className="lg:col-span-8">
					<Card className="border-0 shadow-xl bg-white/45 backdrop-blur-sm mb-4 sm:mb-6">
						<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
								<CardTitle className="text-lg sm:text-xl text-gray-800 flex items-center">
									<Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-purple-600" />
									Available Counselors
								</CardTitle>
								<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
									<div className="relative w-full sm:w-48">
										<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
										<Input placeholder="Search..." className="pl-10 w-full text-sm" />
									</div>
									<Button variant="outline" size="sm" className="w-full sm:w-auto">
										<Filter className="w-4 h-4 mr-1" />
										Filter
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							{loading ? (
								<div className="flex items-center justify-center py-12">
									<Loader2 className="w-8 h-8 animate-spin text-purple-500" />
								</div>
							) : counselors.length === 0 ? (
								<div className="text-center py-12">
									<Users className="w-12 h-12 text-text-secondary/50 mx-auto mb-4" />
									<p className="text-text-secondary">No counselors available</p>
								</div>
							) : (
								<div className="space-y-4 sm:space-y-6">
									{counselors.map((counselor) => (
										<Card key={counselor.id}
											className={`border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${selectedCounselor?.id === counselor.id
												? 'border-purple-400 bg-purple-50'
												: 'border-gray-200 hover:border-purple-200'
												}`}
											onClick={() => setSelectedCounselor(counselor)}>
											<CardContent className="p-4 sm:p-6">
												<div className="flex flex-col sm:flex-row items-start sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 sm:space-x-6">
													{/* Profile Image */}
													<div className="text-4xl sm:text-5xl bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full p-3 sm:p-4 shadow-lg mx-auto sm:mx-0">
														{counselor.image || "👤"}
													</div>

													{/* Counselor Info */}
													<div className="flex-1 w-full">
														<div className="flex flex-col sm:flex-row items-start justify-between mb-2 sm:mb-3 gap-2">
															<div>
																<h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{counselor.name}</h3>
																<p className="text-purple-600 font-medium text-sm sm:text-base mb-1 sm:mb-2">{counselor.specialty}</p>
																<p className="text-text-secondary text-xs sm:text-sm mb-2 sm:mb-3">{counselor.bio}</p>
															</div>
															<Badge variant="success-soft">
																Available
															</Badge>
														</div>

														{/* Stats Row */}
														<div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm">
															<div className="flex items-center text-text-secondary">
																<Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
																{counselor.experience}
															</div>
															<div className="flex items-center text-text-secondary">
																<Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-500 fill-current" />
																{counselor.rating} ({counselor.reviews})
															</div>
															<div className="flex items-center text-text-secondary">
																<MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
																{counselor.languages.join(", ")}
															</div>
														</div>

														{/* Expertise Tags */}
														<div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
															{counselor.expertise.map((skill, index) => (
																<Badge key={index} variant="soft">
																	{skill}
																</Badge>
															))}
														</div>

														{/* Session Types and Next Available */}
														<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
															<div className="flex flex-wrap items-center gap-2 sm:gap-3">
																{counselor.session_types.map((type) => {
																	const IconComponent = sessionTypes.find(st => st.id === type)?.icon || Video;
																	return (
																		<div key={type} className="flex items-center text-xs text-text-secondary">
																			<IconComponent className="w-3 h-3 mr-1" />
																			{sessionTypes.find(st => st.id === type)?.label}
																		</div>
																	);
																})}
															</div>
															<div className="flex items-center text-xs sm:text-sm">
																<Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500" />
																<span className="text-green-600 font-medium">Next: {counselor.next_available}</span>
															</div>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Booking Sidebar */}
				<div className="lg:col-span-4 space-y-4 sm:space-y-6">
					{/* Session Type Selection */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
							<CardTitle className="text-base sm:text-lg text-gray-800">Session Type</CardTitle>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3">
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
											<IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mt-0.5" />
											<div>
												<h4 className="font-medium text-gray-900 text-sm sm:text-base">{type.label}</h4>
												<p className="text-xs sm:text-sm text-text-secondary">{type.description}</p>
											</div>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>

					{/* Calendar */}
					<Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
						<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
							<div className="flex items-center justify-between">
								<CardTitle className="text-base sm:text-lg text-gray-800">Select Date</CardTitle>
								<div className="flex items-center space-x-1 sm:space-x-2">
									<Button variant="outline" size="sm"
										onClick={() => setCurrentWeek(currentWeek - 1)}>
										<ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
									</Button>
									<Button variant="outline" size="sm"
										onClick={() => setCurrentWeek(currentWeek + 1)}>
										<ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							<div className="grid grid-cols-7 gap-1 sm:gap-2">
								{weekDates.map((date, index) => (
									<div key={index}
										className={`p-2 sm:p-3 text-center rounded-lg cursor-pointer transition-all text-xs sm:text-sm ${selectedDate.toDateString() === date.toDateString()
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
						<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
							<CardTitle className="text-base sm:text-lg text-gray-800">Available Times</CardTitle>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							<div className="grid grid-cols-3 sm:grid-cols-2 gap-2">
								{timeSlots.map((time) => (
									<Button key={time}
										variant={selectedTime === time ? "default" : "outline"}
										size="sm"
										className={`text-xs sm:text-sm ${selectedTime === time ? "bg-purple-500 hover:bg-purple-600" : "text-gray-700"}`}
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
							<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
								<CardTitle className="text-base sm:text-lg text-white">Booking Summary</CardTitle>
							</CardHeader>
							<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-2 sm:space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span>Counselor:</span>
									<span className="font-medium">{selectedCounselor.name}</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span>Date:</span>
									<span className="font-medium">{formatDate(selectedDate)}</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span>Time:</span>
									<span className="font-medium">{selectedTime}</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span>Session Type:</span>
									<span className="font-medium capitalize">{sessionType.replace('-', ' ')}</span>
								</div>
								<Button
									className="w-full mt-3 sm:mt-4 bg-white text-purple-600 hover:bg-gray-50 text-sm sm:text-base"
									onClick={handleBookSession}
									disabled={booking}
								>
									{booking ? (
										<Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 animate-spin" />
									) : (
										<CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
									)}
									{booking ? "Booking..." : "Confirm Booking"}
								</Button>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}