"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	LoaderPinwheel,
	Search,
	Video,
	Phone,
	Users,
	CheckCircle2,
	XCircle,
	Clock,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	X,
	Link,
	MapPin,
	Filter,
} from "lucide-react";
import {
	counselorService,
	CounselorBooking,
	BookingFilters,
	MeetingDetails,
} from "@/services/CounselorService";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
	pending: {
		label: "Pending",
		color: "bg-amber-100 text-amber-700 border-amber-200",
		icon: Clock,
	},
	confirmed: {
		label: "Confirmed",
		color: "bg-emerald-100 text-emerald-700 border-emerald-200",
		icon: CheckCircle2,
	},
	cancelled: {
		label: "Cancelled",
		color: "bg-rose-100 text-rose-700 border-rose-200",
		icon: XCircle,
	},
	completed: {
		label: "Completed",
		color: "bg-indigo-100 text-indigo-700 border-indigo-200",
		icon: CheckCircle2,
	},
};

const sessionIcon = (type: string) => {
	switch (type) {
		case "video":
			return <Video className="w-3.5 h-3.5" />;
		case "phone":
			return <Phone className="w-3.5 h-3.5" />;
		default:
			return <Users className="w-3.5 h-3.5" />;
	}
};

interface ConfirmModalProps {
	booking: CounselorBooking;
	onClose: () => void;
	onConfirm: (meetingDetails: MeetingDetails) => Promise<void>;
	isEdit?: boolean;
}

// Validation functions
const isValidUrl = (string: string): boolean => {
	if (!string.trim()) return false;
	try {
		const url = new URL(string);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
};

const isValidPhone = (phone: string): boolean => {
	if (!phone.trim()) return false;
	// Allow digits, spaces, dashes, parentheses, and plus sign
	const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
	return phoneRegex.test(phone.trim());
};

const isValidAddress = (address: string): boolean => {
	const trimmed = address.trim();
	return trimmed.length >= 5 && trimmed.length <= 500;
};

function ConfirmModal({ booking, onClose, onConfirm, isEdit = false }: ConfirmModalProps) {
	// Initialize with existing values if editing
	const [meetLink, setMeetLink] = useState(booking.meeting_link || "");
	const [address, setAddress] = useState(booking.meeting_address || "");
	const [phone, setPhone] = useState(booking.meeting_phone || "");
	const [loading, setLoading] = useState(false);

	// Validation error states
	const [errors, setErrors] = useState<{ link?: string; phone?: string; address?: string }>({});

	const sessionType = booking.session_type;

	const validateForm = (): boolean => {
		const newErrors: typeof errors = {};

		if (sessionType === "video") {
			if (!meetLink.trim()) {
				newErrors.link = "Meeting link is required";
			} else if (!isValidUrl(meetLink)) {
				newErrors.link = "Please enter a valid URL (e.g., https://meet.google.com/...)";
			}
		}

		if (sessionType === "in-person") {
			if (!address.trim()) {
				newErrors.address = "Address is required";
			} else if (!isValidAddress(address)) {
				newErrors.address = "Address must be between 5-500 characters";
			}
		}

		if (sessionType === "phone") {
			if (!phone.trim()) {
				newErrors.phone = "Phone number is required";
			} else if (!isValidPhone(phone)) {
				newErrors.phone = "Please enter a valid phone number";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		try {
			const meetingDetails: MeetingDetails = {};
			if (sessionType === "video") meetingDetails.meet_link = meetLink.trim();
			if (sessionType === "in-person") meetingDetails.address = address.trim();
			if (sessionType === "phone") meetingDetails.phone = phone.trim();

			await onConfirm(meetingDetails);
			onClose();
		} catch (error) {
			toast.error("Failed to " + (isEdit ? "update" : "confirm") + " booking");
		} finally {
			setLoading(false);
		}
	};

	// Check if booking is in the past
	const bookingDateTime = new Date(`${booking.date} ${booking.time}`);
	const isPastBooking = bookingDateTime < new Date();

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<div>
						<h2 className="text-lg font-semibold">{isEdit ? "Edit Session Details" : "Confirm Session"}</h2>
						{isPastBooking && (
							<p className="text-xs text-amber-600 mt-0.5">Past session - editing details only</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				{/* Past Booking Warning */}
				{isPastBooking && (
					<div className="mx-4 mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
						<p className="text-xs text-amber-700">
							<span className="font-medium">Note:</span> This session has already passed.
							{isEdit ? "You can still update the meeting details." : " Use Edit to update details after the session."}
						</p>
					</div>
				)}

				{/* Student Notes */}
				{booking.notes && (
					<div className="mx-4 mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
						<p className="text-xs font-medium text-purple-700 mb-1">Student's Notes:</p>
						<p className="text-sm text-purple-900">{booking.notes}</p>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					<div className="text-sm text-gray-600">
						<p><span className="font-medium">Student:</span> {booking.student_name}</p>
						<p><span className="font-medium">Date:</span> {booking.date} at {booking.time}</p>
						<p><span className="font-medium">Type:</span> {sessionType.replace("-", " ")}</p>
					</div>

					<div className="border-t pt-4">
						<p className="text-sm font-medium text-gray-700 mb-3">
							{sessionType === "video"
								? "Enter meeting link for the student:"
								: sessionType === "in-person"
									? "Enter meeting address for the student:"
									: "Enter contact number for the student:"}
						</p>

						{sessionType === "video" && (
							<div className="space-y-2">
								<label className="flex items-center text-sm font-medium text-gray-600">
									<Link className="w-4 h-4 mr-2" />
									Meeting Link
								</label>
								<Input
									type="url"
									placeholder="https://meet.google.com/..."
									value={meetLink}
									onChange={(e) => {
										setMeetLink(e.target.value);
										if (errors.link) setErrors(prev => ({ ...prev, link: undefined }));
									}}
									className={`rounded-xl ${errors.link ? 'border-red-500 focus:ring-red-300' : ''}`}
								/>
								{errors.link && <p className="text-xs text-red-500">{errors.link}</p>}
							</div>
						)}

						{sessionType === "in-person" && (
							<div className="space-y-2">
								<label className="flex items-center text-sm font-medium text-gray-600">
									<MapPin className="w-4 h-4 mr-2" />
									Address
								</label>
								<Input
									type="text"
									placeholder="123 Main St, City, State"
									value={address}
									onChange={(e) => {
										setAddress(e.target.value);
										if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
									}}
									className={`rounded-xl ${errors.address ? 'border-red-500 focus:ring-red-300' : ''}`}
								/>
								{errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
								<p className="text-xs text-gray-400">{address.length}/500 characters (min 5)</p>
							</div>
						)}

						{sessionType === "phone" && (
							<div className="space-y-2">
								<label className="flex items-center text-sm font-medium text-gray-600">
									<Phone className="w-4 h-4 mr-2" />
									Phone Number
								</label>
								<Input
									type="tel"
									placeholder="+1 (555) 123-4567"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="rounded-xl"
								/>
							</div>
						)}
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1 rounded-xl"
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="flex-1 bg-emerald-500 hover:bg-emerald-600 rounded-xl"
							disabled={loading}
						>
							{loading ? (
								<LoaderPinwheel className="w-4 h-4 animate-spin mr-2" />
							) : (
								<CheckCircle2 className="w-4 h-4 mr-2" />
							)}
							{isEdit ? "Update" : "Confirm"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default function CounsellorBookings() {
	const [bookings, setBookings] = useState<CounselorBooking[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [page, setPage] = useState(1);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [confirmModal, setConfirmModal] = useState<CounselorBooking | null>(null);
	const [editModal, setEditModal] = useState<CounselorBooking | null>(null);

	const fetchBookings = useCallback(async (filters?: BookingFilters) => {
		setLoading(true);
		setError("");
		try {
			const data = await counselorService.getBookings(filters);
			setBookings(data);
		} catch (e: any) {
			setError(e.message);
			toast.error("Failed to load bookings");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBookings({ status: statusFilter && statusFilter !== "__all__" ? statusFilter : undefined });
	}, [fetchBookings, statusFilter]);

	const filtered = bookings.filter(
		(b) =>
			search === "" ||
			(b.student_name || "").toLowerCase().includes(search.toLowerCase()) ||
			(b.student_email || "").toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);

	const counts = {
		total: bookings.length,
		pending: bookings.filter((b) => b.status === "pending").length,
		confirmed: bookings.filter((b) => b.status === "confirmed").length,
	};

	const handleConfirmWithDetails = async (bookingId: string, meetingDetails: MeetingDetails) => {
		setActionLoading(bookingId);
		try {
			// Send flat fields to match backend API
			await counselorService.updateBooking(bookingId, {
				status: "confirmed",
				meeting_link: meetingDetails.meet_link,
				meeting_address: meetingDetails.address,
				meeting_phone: meetingDetails.phone
			});
			toast.success("Session confirmed with meeting details");
			fetchBookings({ status: statusFilter && statusFilter !== "__all__" ? statusFilter : undefined });
		} catch (e: any) {
			toast.error("Failed to confirm: " + e.message);
			throw e;
		} finally {
			setActionLoading(null);
		}
	};

	// Handle updating meeting details for confirmed/completed bookings
	const handleUpdateMeetingDetails = async (bookingId: string, meetingDetails: MeetingDetails) => {
		setActionLoading(bookingId);
		try {
			await counselorService.updateBooking(bookingId, {
				meeting_link: meetingDetails.meet_link || null,
				meeting_address: meetingDetails.address || null,
				meeting_phone: meetingDetails.phone || null
			});
			toast.success("Meeting details updated");
			fetchBookings({ status: statusFilter && statusFilter !== "__all__" ? statusFilter : undefined });
		} catch (e: any) {
			toast.error("Failed to update: " + e.message);
			throw e;
		} finally {
			setActionLoading(null);
		}
	};

	// Handle canceling - clears meeting details if previously confirmed
	const handleCancelBooking = async (id: string) => {
		setActionLoading(id);
		try {
			// When cancelling, also clear meeting details
			await counselorService.updateBooking(id, {
				status: "cancelled",
				meeting_link: null,
				meeting_address: null,
				meeting_phone: null
			});
			toast.success("Session cancelled");
			fetchBookings({ status: statusFilter && statusFilter !== "__all__" ? statusFilter : undefined });
		} catch (e: any) {
			toast.error("Failed to cancel: " + e.message);
		} finally {
			setActionLoading(null);
		}
	};

	return (
		<div className="p-4 sm:p-6 space-y-4">
			{/* Confirm Modal */}
			{confirmModal && (
				<ConfirmModal
					booking={confirmModal}
					onClose={() => setConfirmModal(null)}
					onConfirm={(details) => handleConfirmWithDetails(confirmModal.id, details)}
				/>
			)}

			{/* Edit Modal */}
			{editModal && (
				<ConfirmModal
					booking={editModal}
					isEdit={true}
					onClose={() => setEditModal(null)}
					onConfirm={(details) => handleUpdateMeetingDetails(editModal.id, details)}
				/>
			)}

			{/* Summary Cards */}
			<div className="grid grid-cols-3 gap-4">
				<Card>
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{counts.total}</p>
							<p className="text-xs text-text-secondary">Total Bookings</p>
						</div>
						<div className="p-2.5 rounded-xl bg-indigo-500">
							<CalendarDays className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{counts.pending}</p>
							<p className="text-xs text-text-secondary">Pending</p>
						</div>
						<div className="p-2.5 rounded-xl bg-amber-500">
							<Clock className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{counts.confirmed}</p>
							<p className="text-xs text-text-secondary">Confirmed</p>
						</div>
						<div className="p-2.5 rounded-xl bg-emerald-500">
							<CheckCircle2 className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">My Bookings</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
								<Input
									placeholder="Search student..."
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
										setPage(1);
									}}
									className="pl-9 w-full sm:w-48 text-sm rounded-xl"
								/>
							</div>
							<Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
								<SelectTrigger className="h-10 rounded-xl gap-2">
									<Filter className="w-4 h-4 text-text-secondary" />
									<SelectValue placeholder="All Statuses" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__all__">All Statuses</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="confirmed">Confirmed</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{loading ? (
						<div className="flex justify-center py-12">
							<LoaderPinwheel className="animate-spin w-6 h-6 text-muted-foreground" />
						</div>
					) : error ? (
						<div className="text-center py-12 text-red-500 text-sm">{error}</div>
					) : paginated.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 gap-2">
							<CalendarDays className="w-8 h-8 text-text-secondary/50" />
							<p className="text-sm text-text-secondary">No bookings found</p>
						</div>
					) : (
						<>
							<div className="space-y-2">
								{paginated.map((b) => {
									const status = statusConfig[b.status] || statusConfig.pending;
									const StatusIcon = status.icon;
									return (
										<div
											key={b.id}
											className="flex items-center justify-between p-4 rounded-2xl border border-border/40 hover:border-border/80 transition-all bg-gradient-to-br from-background to-background/80 gap-4"
										>
											{/* Session Type */}
											<div className="hidden sm:flex p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
												{sessionIcon(b.session_type)}
											</div>

											{/* Info */}
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 flex-wrap">
													<p className="text-sm font-semibold">
														{b.student_name || "Unknown Student"}
													</p>
													<span className="text-xs text-text-secondary capitalize flex items-center gap-1">
														{sessionIcon(b.session_type)}
														{b.session_type.replace("-", " ")}
													</span>
												</div>
												<div className="flex items-center gap-3 mt-1 flex-wrap">
													<span className="text-xs text-text-secondary">
														{b.date} at {b.time}
													</span>
												</div>
												{b.notes && (
													<div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
														<p className="text-xs text-purple-700">
															<span className="font-medium">Notes:</span> {b.notes}
														</p>
													</div>
												)}
												{b.status === "confirmed" && (
													(() => {
														const meetLink = b.meeting_link || b.meeting_details?.meet_link;
														const address = b.meeting_address || b.meeting_details?.address;
														const phone = b.meeting_phone || b.meeting_details?.phone;

														if (meetLink || address || phone) {
															return (
																<div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
																	<p className="text-xs text-emerald-700">
																		<span className="font-medium">Meeting Info:</span>{" "}
																		{meetLink && `Link: ${meetLink}`}
																		{address && `Address: ${address}`}
																		{phone && `Phone: ${phone}`}
																	</p>
																</div>
															);
														}
														return null;
													})()
												)}
											</div>

											{/* Status */}
											<Badge variant={b.status} className="shrink-0">
												<StatusIcon className="w-3 h-3 mr-1" />
												{status.label}
											</Badge>

											{/* Actions */}
											<div className="flex items-center gap-2 shrink-0">
												{actionLoading === b.id ? (
													<LoaderPinwheel className="animate-spin w-4 h-4" />
												) : (
													<>
														{b.status === "pending" && (
															<button
																className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
																onClick={() => setConfirmModal(b)}
															>
																Confirm
															</button>
														)}
														{(b.status === "confirmed" || b.status === "completed") && (
															<button
																className="px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
																onClick={() => setEditModal(b)}
															>
																Edit
															</button>
														)}
														{b.status !== "cancelled" &&
															b.status !== "completed" && (
																<button
																	className="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
																	onClick={() =>
																		handleCancelBooking(b.id)
																	}
																>
																	Cancel
																</button>
															)}
													</>
												)}
											</div>
										</div>
									);
								})}
							</div>

							{totalPages > 1 && (
								<div className="flex items-center justify-between mt-4 pt-4 border-t">
									<p className="text-xs text-text-secondary">
										Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
										{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
										{filtered.length}
									</p>
									<div className="flex items-center gap-2">
										<button
											className="p-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
											disabled={page === 1}
											onClick={() => setPage(page - 1)}
										>
											<ChevronLeft className="w-4 h-4" />
										</button>
										<span className="text-xs font-medium">
											{page} / {totalPages}
										</span>
										<button
											className="p-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
											disabled={page === totalPages}
											onClick={() => setPage(page + 1)}
										>
											<ChevronRight className="w-4 h-4" />
										</button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
