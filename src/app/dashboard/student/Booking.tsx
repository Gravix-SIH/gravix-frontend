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
	Loader2,
	RefreshCw,
	AlertCircle
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { studentService, CounselorResponse } from "@/services/studentService";
import { toast } from "sonner";
import { BOOKING_CONFIG } from "@/utils/constants";
import {
	isBeyondMaxAdvance,
	isSessionTypeSupported,
	getUnsupportedSessionTypes,
	isSlotDisabled,
	isDateDisabled,
	MAX_NOTES_LENGTH,
} from "@/utils/bookingValidation";

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
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [sessionType, setSessionType] = useState('video');
	const [currentWeek, setCurrentWeek] = useState(0);
	const [booking, setBooking] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
	const [slotsLoading, setSlotsLoading] = useState(false);
	const [bookingSuccess, setBookingSuccess] = useState(false);
	const [notes, setNotes] = useState('');
	const [bookingLimits, setBookingLimits] = useState({ daily: 0, weekly: 0 });

	// Load counselors
	const loadCounselors = useCallback(async () => {
		setLoading(true);
		try {
			const data = await studentService.getCounselors();
			setCounselors(data);
		} catch (error) {
			console.error('Failed to load counselors:', error);
			toast.error('Failed to load counselors. Please try again.');
		} finally {
			setLoading(false);
		}
	}, []);

	// Load booking limits (persisted in sessionStorage to survive tab switches)
	const loadBookingLimits = useCallback(async () => {
		// First check if we have cached limits from today
		const today = new Date().toDateString();
		const cachedLimits = sessionStorage.getItem('bookingLimits');
		const cachedDate = sessionStorage.getItem('bookingLimitsDate');

		if (cachedLimits && cachedDate === today) {
			setBookingLimits(JSON.parse(cachedLimits));
			return;
		}

		try {
			const counts = await studentService.getBookingCount();
			setBookingLimits(counts);
			// Cache in sessionStorage
			sessionStorage.setItem('bookingLimits', JSON.stringify(counts));
			sessionStorage.setItem('bookingLimitsDate', today);
		} catch {
			// Silently fail - use cached or default
			if (cachedLimits) {
				setBookingLimits(JSON.parse(cachedLimits));
			}
		}
	}, []);

	// Load booked slots
	const loadBookedSlots = useCallback(async () => {
		if (!selectedCounselor || !selectedDate) return;

		setSlotsLoading(true);
		try {
			const dateStr = selectedDate.toISOString().split('T')[0];
			const slots = await studentService.getBookedSlots(selectedCounselor.id, dateStr);
			setBookedSlots(new Set(slots));
		} catch (error) {
			console.error('Failed to load booked slots:', error);
			toast.warning('Could not load booking status. Please try again.');
			setBookedSlots(new Set());
		} finally {
			setSlotsLoading(false);
		}
	}, [selectedCounselor, selectedDate]);

	// Initial load
	useEffect(() => {
		loadCounselors();
		loadBookingLimits();
	}, [loadCounselors, loadBookingLimits]);

	// Refresh counselors periodically (every 5 minutes)
	useEffect(() => {
		const interval = setInterval(() => {
			loadCounselors();
		}, BOOKING_CONFIG.COUNSELOR_REFRESH_INTERVAL_MS);
		return () => clearInterval(interval);
	}, [loadCounselors]);

	// Fetch booked slots when counselor or date changes
	useEffect(() => {
		loadBookedSlots();
	}, [loadBookedSlots]);

	// Reset time when counselor changes
	useEffect(() => {
		if (selectedCounselor && selectedTime) {
			setSelectedTime(null);
			toast.info('Please select a new time for the updated counselor');
		}
	}, [selectedCounselor]);

	// Reset time when date changes
	useEffect(() => {
		if (selectedTime) {
			setSelectedTime(null);
		}
	}, [selectedDate]);

	// Reset time when session type changes
	useEffect(() => {
		if (selectedTime) {
			setSelectedTime(null);
			toast.info('Please select a new time for the updated session type');
		}
	}, [sessionType]);

	// Handle counselor selection with availability check
	const handleCounselorSelect = (counselor: CounselorResponse) => {
		const isStillAvailable = counselors.find(c => c.id === counselor.id);
		if (!isStillAvailable) {
			toast.warning('This counselor is no longer available. Please select another.');
			setSelectedCounselor(null);
			setSelectedTime(null);
			return;
		}
		setSelectedCounselor(counselor);
	};

	const handleBookSession = async () => {
		if (!selectedCounselor || !selectedTime) return;
		if (booking) return; // Double-click prevention

		// Check booking limits
		if (bookingLimits.daily >= BOOKING_CONFIG.MAX_DAILY_BOOKINGS) {
			toast.error('Daily booking limit reached. Please try again tomorrow.');
			return;
		}
		if (bookingLimits.weekly >= BOOKING_CONFIG.MAX_WEEKLY_BOOKINGS) {
			toast.error('Weekly booking limit reached. Please book a session next week.');
			return;
		}

		setBooking(true);
		try {
			await studentService.bookSession({
				counsellor_id: selectedCounselor.id,
				date: selectedDate.toISOString().split('T')[0],
				time: selectedTime,
				session_type: sessionType as 'video' | 'in-person' | 'phone',
				notes: notes.trim() || undefined
			});

			// Optimistically update local state
			setBookedSlots(prev => new Set([...prev, selectedTime]));
			setBookingSuccess(true);
			const newLimits = { daily: bookingLimits.daily + 1, weekly: bookingLimits.weekly + 1 };
			setBookingLimits(newLimits);
			// Update sessionStorage cache
			sessionStorage.setItem('bookingLimits', JSON.stringify(newLimits));
			sessionStorage.setItem('bookingLimitsDate', new Date().toDateString());
			toast.success('Session booked successfully!');

			// Reset form after delay
			setTimeout(() => {
				setSelectedCounselor(null);
				setSelectedTime(null);
				setNotes('');
				setBookedSlots(new Set());
				setBookingSuccess(false);
				setCurrentWeek(0);
				setSelectedDate(new Date());
				setSessionType('video');
			}, 3000);
		} catch (error) {
			console.error('Booking failed:', error);
			const errorMessage = error instanceof Error ? error.message : 'Booking failed. Please try again.';

			// Handle 409 conflict specifically
			if (errorMessage.includes('already been booked') || errorMessage.includes('409')) {
				await loadBookedSlots();
				toast.error('This slot was just booked by another user. Please select another time.');
			} else if (errorMessage.includes('timed out') || errorMessage.includes('AbortError')) {
				toast.error('Request timed out. Please check your connection and try again.');
			} else {
				toast.error(errorMessage);
			}
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

	const canGoForward = () => {
		const nextWeekStart = getWeekDates(currentWeek + 1)[0];
		return !isBeyondMaxAdvance(nextWeekStart);
	};

	const weekDates = getWeekDates(currentWeek);

	// Filter counselors by search query
	const filteredCounselors = counselors.filter(c =>
		c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		c.specialty.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Check if all slots are booked
	const allSlotsBooked = timeSlots.every(slot => bookedSlots.has(slot));

	// Check if booking limits are reached
	const hasReachedDailyLimit = bookingLimits.daily >= BOOKING_CONFIG.MAX_DAILY_BOOKINGS;
	const hasReachedWeeklyLimit = bookingLimits.weekly >= BOOKING_CONFIG.MAX_WEEKLY_BOOKINGS;

	return (
		<div className="p-4 sm:p-6 h-full">
			{/* Header */}
			<div className="mb-6 sm:mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Book a Session</h1>
				<p className="text-purple-700 text-sm sm:text-base">Connect with our qualified mental health professionals</p>
			</div>

			{/* Booking Limits Warning */}
			{(hasReachedDailyLimit || hasReachedWeeklyLimit) && (
				<Card className="border-red-200 bg-red-50 mb-4">
					<CardContent className="p-4 flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
						<div>
							{hasReachedDailyLimit && (
								<p className="text-sm text-red-700 font-medium">
									Daily booking limit reached ({BOOKING_CONFIG.MAX_DAILY_BOOKINGS}/day).
								</p>
							)}
							{hasReachedWeeklyLimit && (
								<p className="text-sm text-red-700 font-medium">
									Weekly booking limit reached ({BOOKING_CONFIG.MAX_WEEKLY_BOOKINGS}/week).
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			)}

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
										<Input
											placeholder="Search..."
											className="pl-10 w-full text-sm"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
										/>
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
							) : filteredCounselors.length === 0 ? (
								<div className="text-center py-12">
									<Users className="w-12 h-12 text-text-secondary/50 mx-auto mb-4" />
									<p className="text-text-secondary mb-2">
										{counselors.length === 0 ? 'No counselors available' : 'No counselors match your search'}
									</p>
									{counselors.length === 0 ? (
										<Button variant="outline" size="sm" onClick={() => loadCounselors()}>
											<RefreshCw className="w-4 h-4 mr-2" />
											Refresh
										</Button>
									) : (
										<Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
											Clear search
										</Button>
									)}
								</div>
							) : (
								<div className="space-y-4 sm:space-y-6">
									{filteredCounselors.map((counselor) => (
										<Card key={counselor.id}
											className={`border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${selectedCounselor?.id === counselor.id
												? 'border-purple-400 bg-purple-50'
												: 'border-gray-200 hover:border-purple-200'
												}`}
											onClick={() => handleCounselorSelect(counselor)}>
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
								const isSupported = isSessionTypeSupported(selectedCounselor, type.id);
								const isSelected = sessionType === type.id;

								return (
									<div key={type.id}
										className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${!isSupported
											? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
											: isSelected
												? 'border-purple-400 bg-purple-50'
												: 'border-gray-200 hover:border-purple-200'
											}`}
										onClick={() => isSupported && setSessionType(type.id)}>
										<div className="flex items-start space-x-3">
											<IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 ${!isSupported ? 'text-gray-400' : 'text-purple-600'}`} />
											<div>
												<h4 className={`font-medium text-sm sm:text-base ${!isSupported ? 'text-gray-400' : 'text-gray-900'}`}>
													{type.label}
													{!isSupported && <span className="text-xs ml-1">(unavailable)</span>}
												</h4>
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
										onClick={() => setCurrentWeek(currentWeek + 1)}
										disabled={!canGoForward()}>
										<ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 ${!canGoForward() ? 'text-gray-300' : 'text-black'}`} />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							<div className="grid grid-cols-7 gap-1 sm:gap-2">
								{weekDates.map((date, index) => {
									const dateCheck = isDateDisabled(date);
									const past = dateCheck.disabled;
									const reason = dateCheck.reason;
									return (
										<div key={index}
											className={`p-2 sm:p-3 text-center rounded-lg cursor-pointer transition-all text-xs sm:text-sm ${
												past
													? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
													: selectedDate.toDateString() === date.toDateString()
														? 'bg-purple-500 text-white'
														: isToday(date)
															? 'bg-purple-100 text-purple-800 font-medium hover:bg-purple-200'
															: 'hover:bg-gray-100 text-gray-700'
											}`}
											onClick={() => !past && setSelectedDate(date)}
											title={reason}>
											<div className="font-medium">{date.getDate()}</div>
											<div className="text-xs opacity-75">
												{date.toLocaleDateString('en-US', { weekday: 'short' })}
											</div>
										</div>
									);
								})}
							</div>
							<p className="text-xs text-text-secondary mt-2 text-center">
								Book up to {BOOKING_CONFIG.MAX_ADVANCE_DAYS} days in advance
							</p>
						</CardContent>
					</Card>

					{/* Time Slots */}
					<Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
						<CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
							<CardTitle className="text-base sm:text-lg text-gray-800">
								{selectedCounselor ? 'Available Times' : 'Select a counselor first'}
							</CardTitle>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							{!selectedCounselor ? (
								<div className="text-center py-6 text-text-secondary text-sm">
									<Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
									<p>Please select a counselor to see available times</p>
								</div>
							) : slotsLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="w-6 h-6 animate-spin text-purple-500" />
								</div>
							) : allSlotsBooked ? (
								<div className="text-center py-8">
									<Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
									<p className="text-text-secondary font-medium">No available slots</p>
									<p className="text-text-secondary text-sm">All times are booked for this day</p>
								</div>
							) : (
								<div className="grid grid-cols-3 sm:grid-cols-2 gap-2">
									{timeSlots.map((time) => {
										const booked = bookedSlots.has(time);
										const slotCheck = isSlotDisabled(time, selectedDate, booked);
										const disabled = slotCheck.disabled;
										const reason = slotCheck.reason;

										return (
											<Button key={time}
												variant={selectedTime === time ? "default" : "outline"}
												size="sm"
												disabled={disabled}
												className={`text-xs sm:text-sm ${
													disabled
														? 'opacity-50 bg-gray-100 text-gray-400'
														: selectedTime === time
															? 'bg-purple-500 hover:bg-purple-600'
															: 'text-gray-700'
												}`}
												onClick={() => !disabled && setSelectedTime(time)}
												title={reason}>
												{time}
												{booked && !disabled && <span className="ml-1 text-[10px]">(booked)</span>}
											</Button>
										);
									})}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Booking Summary or Success */}
					{bookingSuccess ? (
						<Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
							<CardContent className="p-6 text-center">
								<CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
								<h3 className="text-lg font-bold mb-2">Booking Confirmed!</h3>
								<p className="text-sm opacity-90">You will receive a confirmation email shortly.</p>
							</CardContent>
						</Card>
					) : selectedCounselor && selectedTime ? (
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

								{/* Notes Field */}
								<div className="pt-2">
									<label className="text-sm text-white/80 mb-1 block">Notes (optional)</label>
									<textarea
										value={notes}
										onChange={(e) => {
											if (e.target.value.length <= MAX_NOTES_LENGTH) {
												setNotes(e.target.value);
											}
										}}
										placeholder="Any additional information for your counselor..."
										className="w-full p-3 border border-white/20 rounded-lg text-sm resize-none bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
										rows={3}
									/>
									<div className="text-right text-xs text-white/70 mt-1">
										{notes.length}/{MAX_NOTES_LENGTH}
									</div>
								</div>

								<Button
									className="w-full mt-3 sm:mt-4 bg-white text-purple-600 hover:bg-gray-50 text-sm sm:text-base"
									onClick={handleBookSession}
									disabled={booking || hasReachedDailyLimit || hasReachedWeeklyLimit}
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
					) : null}
				</div>
			</div>
		</div>
	);
}
