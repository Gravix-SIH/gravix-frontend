"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	LoaderPinwheel,
	Search,
	Filter,
	Video,
	Phone,
	Users,
	CheckCircle2,
	XCircle,
	Clock,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	RefreshCw,
	Link,
	MapPin,
} from "lucide-react";
import {
	adminService,
	AdminBooking,
	BookingFilters,
} from "@/services/adminService";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
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

const sessionIcon = (type: string): React.ElementType => {
	switch (type) {
		case "video":
			return <Video className="w-3.5 h-3.5" />;
		case "phone":
			return <Phone className="w-3.5 h-3.5" />;
		default:
			return <Users className="w-3.5 h-3.5" />;
	}
};

// Check if a booking is in the past
const isPastBooking = (date: string, time: string): boolean => {
	const bookingDate = new Date(date);
	const timeMatch = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
	if (!timeMatch) return false;

	let hours = parseInt(timeMatch[1]);
	const minutes = parseInt(timeMatch[2]);
	const period = timeMatch[3].toUpperCase();

	if (period === "PM" && hours !== 12) hours += 12;
	if (period === "AM" && hours === 12) hours = 0;

	const bookingDateTime = new Date(bookingDate);
	bookingDateTime.setHours(hours, minutes, 0, 0);
	return bookingDateTime < new Date();
};

export default function AdminBookings() {
	const [bookings, setBookings] = useState<AdminBooking[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [page, setPage] = useState(1);
	const [actionLoading, setActionLoading] = useState<string | null>(null);

	const fetchBookings = useCallback(async (filters?: BookingFilters) => {
		setLoading(true);
		setError("");
		try {
			const data = await adminService.getBookings(filters);
			setBookings(data);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unknown error");
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
			(b.counsellor_name || "").toLowerCase().includes(search.toLowerCase()) ||
			(b.student_email || "").toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);

	const handleStatusChange = async (id: string, status: string) => {
		setActionLoading(id);
		try {
			// When cancelling, also clear meeting details
			if (status === "cancelled") {
				await adminService.updateBooking(id, {
					status,
					meeting_link: null,
					meeting_address: null,
					meeting_phone: null
				});
			} else {
				await adminService.updateBooking(id, { status });
			}
			toast.success(`Booking ${status === "confirmed" ? "approved" : status === "cancelled" ? "cancelled" : "updated"}`);
			fetchBookings({ status: statusFilter && statusFilter !== "__all__" ? statusFilter : undefined });
		} catch (e) {
			toast.error("Failed to update booking: " + (e instanceof Error ? e.message : "Unknown error"));
		} finally {
			setActionLoading(null);
		}
	};

	const counts = {
		total: bookings.length,
		pending: bookings.filter((b) => b.status === "pending").length,
		confirmed: bookings.filter((b) => b.status === "confirmed").length,
		completed: bookings.filter((b) => b.status === "completed").length,
		cancelled: bookings.filter((b) => b.status === "cancelled").length,
	};

	return (
		<div className="p-4 sm:p-6 space-y-4">
			{/* Summary Cards */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<Card>
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{counts.total}</p>
							<p className="text-xs text-text-secondary">Total</p>
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
				<Card>
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{counts.completed + counts.cancelled}</p>
							<p className="text-xs text-text-secondary">Ended</p>
						</div>
						<div className="p-2.5 rounded-xl bg-gray-500">
							<XCircle className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">All Bookings</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2 items-center">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => fetchBookings()}
								disabled={loading}
								className="h-9 w-9 p-0"
							>
								<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
							</Button>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
								<Input
									placeholder="Search..."
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
										setPage(1);
									}}
									className="pl-9 w-full sm:w-56 text-sm"
								/>
							</div>
							<Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
								<SelectTrigger className="h-10 w-full sm:w-44 rounded-xl gap-2">
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
						<div className="flex items-center justify-center py-12 text-red-500 text-sm gap-2">
							<XCircle className="w-4 h-4" />
							{error}
						</div>
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
									const past = isPastBooking(b.date, b.time);

									// Get meeting details from flat fields
									const meetLink = b.meeting_link || b.meeting_details?.meet_link;
									const address = b.meeting_address || b.meeting_details?.address;
									const phone = b.meeting_phone || b.meeting_details?.phone;

									return (
										<div
											key={b.id}
											className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border gap-3 transition-all ${
												past
													? 'bg-gray-50 border-gray-200'
													: 'bg-gradient-to-br from-background to-background/80 border-border/40 hover:border-border/80'
											}`}
										>
											{/* Left: Session type + Info */}
											<div className="flex items-start gap-3 flex-1 w-full">
												<div className={`hidden sm:flex p-2.5 rounded-xl shrink-0 ${past ? 'bg-gray-100 text-gray-500' : 'bg-indigo-50 text-indigo-600'}`}>
													{sessionIcon(b.session_type)}
												</div>

												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 flex-wrap">
														<p className={`text-sm font-semibold ${past ? 'text-gray-500' : 'text-gray-900'}`}>
															{b.student_name || "Unknown Student"}
														</p>
														<span className="text-xs text-text-secondary">
															with {b.counsellor_name || "Unknown Counsellor"}
														</span>
													</div>

													<div className="flex items-center gap-3 mt-1 flex-wrap">
														<span className={`text-xs ${past ? 'text-gray-400' : 'text-text-secondary'}`}>
															{b.date} at {b.time}
														</span>
														<span className={`text-xs capitalize flex items-center gap-1 ${past ? 'text-gray-400' : 'text-text-secondary'}`}>
															{sessionIcon(b.session_type)}
															{b.session_type.replace("-", " ")}
														</span>
													</div>

													{/* Notes */}
													{b.notes && (
														<div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
															<p className="text-xs text-purple-700">
																<span className="font-medium">Note:</span> {b.notes}
															</p>
														</div>
													)}

													{/* Meeting details for confirmed bookings */}
													{b.status === "confirmed" && (meetLink || address || phone) && (
														<div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
															<p className="text-xs font-medium text-emerald-700 mb-1">Meeting Details:</p>
															{meetLink && (
																<p className="text-xs text-blue-600 flex items-center gap-1">
																	<Link className="w-3 h-3" />
																	Video call link provided
																</p>
															)}
															{address && (
																<p className="text-xs text-gray-600 flex items-center gap-1">
																	<MapPin className="w-3 h-3" />
																	{address}
																</p>
															)}
															{phone && (
																<p className="text-xs text-gray-600 flex items-center gap-1">
																	<Phone className="w-3 h-3" />
																	{phone}
																</p>
															)}
														</div>
													)}
												</div>
											</div>

											{/* Right: Status + Actions */}
											<div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
												<Badge variant={past ? "secondary" : b.status} className={past ? 'bg-gray-100 text-gray-500' : ''}>
													<StatusIcon className="w-3 h-3 mr-1" />
													{past ? 'Session Ended' : status.label}
												</Badge>

												<div className="flex items-center gap-2">
													{actionLoading === b.id ? (
														<LoaderPinwheel className="animate-spin w-4 h-4" />
													) : (
														<>
															{b.status === "pending" && (
																<button
																	className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
																	onClick={() => handleStatusChange(b.id, "confirmed")}
																>
																	Approve
																</button>
															)}
															{b.status !== "cancelled" && b.status !== "completed" && (
																<button
																	className="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
																	onClick={() => handleStatusChange(b.id, "cancelled")}
																>
																	Cancel
																</button>
															)}
														</>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{totalPages > 1 && (
								<div className="flex items-center justify-between mt-4 pt-4 border-t">
									<p className="text-xs text-text-secondary">
										Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
									</p>
									<div className="flex items-center gap-2">
										<button
											className="p-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50 transition-colors"
											disabled={page === 1}
											onClick={() => setPage(page - 1)}
										>
											<ChevronLeft className="w-4 h-4" />
										</button>
										<span className="text-xs font-medium">
											{page} / {totalPages}
										</span>
										<button
											className="p-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
