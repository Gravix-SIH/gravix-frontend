"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderPinwheel } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	Filter,
	FileText,

	User,
	Wrench,
	BookOpen,
} from "lucide-react";
import {
	adminService,
	AuditLog,
	AuditLogFilters,
} from "@/services/adminService";

const actionConfig: Record<string, { label: string; color: string; bg: string }> = {
	create: { label: "Created", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
	update: { label: "Updated", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
	delete: { label: "Deleted", color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
	approve: { label: "Approved", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
	cancel: { label: "Cancelled", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
	login: { label: "Login", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
	logout: { label: "Logout", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
};

const targetIcon = (type: string) => {
	switch (type) {
		case "User":
			return <User className="w-3.5 h-3.5" />;
		case "Booking":
			return <Wrench className="w-3.5 h-3.5" />;
		case "Resource":
			return <BookOpen className="w-3.5 h-3.5" />;
		default:
			return <FileText className="w-3.5 h-3.5" />;
	}
};

function formatTimestamp(ts: string) {
	const date = new Date(ts);
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const mins = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminLogs() {
	const [logs, setLogs] = useState<AuditLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [actionFilter, setActionFilter] = useState("");
	const [targetFilter, setTargetFilter] = useState("");
	const [search, setSearch] = useState("");

	const fetchLogs = useCallback(async (filters?: AuditLogFilters) => {
		setLoading(true);
		setError("");
		try {
			const data = await adminService.getAuditLogs(filters);
			setLogs(data);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchLogs({
			action: actionFilter && actionFilter !== "__all__" ? actionFilter : undefined,
			target_type: targetFilter && targetFilter !== "__all__" ? targetFilter : undefined,
		});
	}, [fetchLogs, actionFilter, targetFilter]);

	const filtered = logs.filter(
		(l) =>
			search === "" ||
			(l.actor_name || "").toLowerCase().includes(search.toLowerCase()) ||
			(l.actor_email || "").toLowerCase().includes(search.toLowerCase()) ||
			(l.target_type || "").toLowerCase().includes(search.toLowerCase())
	);

	const groupedLogs = filtered.reduce<Record<string, AuditLog[]>>((acc, log) => {
		const date = new Date(log.timestamp).toDateString();
		if (!acc[date]) acc[date] = [];
		acc[date].push(log);
		return acc;
	}, {});

	return (
		<div className="p-4 sm:p-6 space-y-4">
			{/* Stats */}
			<div className="grid grid-cols-2 gap-4">
				<Card>
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{logs.length}</p>
							<p className="text-xs text-text-secondary">Total Log Entries</p>
						</div>
						<div className="p-2.5 rounded-xl bg-indigo-500">
							<FileText className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">
								{[...new Set(logs.map((l) => l.actor_email).filter(Boolean))].length}
							</p>
							<p className="text-xs text-text-secondary">Active Admins</p>
						</div>
						<div className="p-2.5 rounded-xl bg-emerald-500">
							<User className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">Audit Trail</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2">
							<div className="relative w-full sm:max-w-[160px]">
								<Select value={actionFilter} onValueChange={setActionFilter}>
									<SelectTrigger className="h-10 pl-8 pr-3 w-full rounded-xl">
										<div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
											<Filter className="w-4 h-4 text-text-secondary" />
										</div>
										<SelectValue placeholder="All Actions" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="__all__">All Actions</SelectItem>
										<SelectItem value="create">Created</SelectItem>
										<SelectItem value="update">Updated</SelectItem>
										<SelectItem value="delete">Deleted</SelectItem>
										<SelectItem value="approve">Approved</SelectItem>
										<SelectItem value="cancel">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="relative w-full sm:max-w-[160px]">
								<Select value={targetFilter} onValueChange={setTargetFilter}>
									<SelectTrigger className="h-10 pl-8 pr-3 w-full rounded-xl">
										<div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
											<Filter className="w-4 h-4 text-text-secondary" />
										</div>
										<SelectValue placeholder="All Targets" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="__all__">All Targets</SelectItem>
										<SelectItem value="User">User</SelectItem>
										<SelectItem value="Booking">Booking</SelectItem>
										<SelectItem value="Resource">Resource</SelectItem>
									</SelectContent>
								</Select>
							</div>
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
					) : filtered.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 gap-2">
							<FileText className="w-8 h-8 text-text-secondary/50" />
							<p className="text-sm text-text-secondary">No audit logs found</p>
						</div>
					) : (
						<div className="space-y-6">
							{Object.entries(groupedLogs).map(([date, dayLogs]) => (
								<div key={date}>
									<p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 px-1">
										{new Date(date).toLocaleDateString("en-US", {
											weekday: "long",
											month: "long",
											day: "numeric",
										})}
									</p>
									<div className="space-y-2">
										{dayLogs.map((log) => {
											const cfg =
												actionConfig[log.action] || actionConfig.update;
											return (
												<div
													key={log.id}
													className="flex items-start gap-3 p-3 rounded-2xl border border-border/40 hover:border-border/80 transition-all bg-gradient-to-br from-background to-background/80"
												>
													{/* Action Badge */}
													<div
														className={`px-2.5 py-1 rounded-xl border text-xs font-medium shrink-0 ${cfg.bg} ${cfg.color}`}
													>
														{cfg.label}
													</div>

													{/* Content */}
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 flex-wrap">
															<div className="flex items-center gap-1 text-xs text-text-secondary">
																{targetIcon(log.target_type)}
																<span className="font-medium">
																	{log.target_type}
																</span>
																{log.target_id && (
																	<span className="text-text-secondary font-mono">
																		#{log.target_id.slice(0, 8)}
																	</span>
																)}
															</div>
														</div>

														{/* Details */}
														{log.details &&
															Object.keys(log.details).length > 0 && (
																<div className="mt-1.5 p-2 rounded-lg bg-background text-xs text-text-secondary font-mono">
																	{Object.entries(log.details).map(([k, v]) => (
																		<div key={k}>
																			<span className="text-indigo-600">{k}</span>:{" "}
																			{typeof v === "object"
																				? JSON.stringify(v)
																				: String(v)}
																		</div>
																	))}
																</div>
															)}

														{/* Actor & IP */}
														<div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary">
															<span className="font-medium">
																{log.actor_name || log.actor_email || "System"}
									</span>
															{log.ip_address && (
																<span className="font-mono text-text-secondary">
																	{log.ip_address}
																</span>
															)}
														</div>
													</div>

													{/* Time */}
													<span className="text-xs text-text-secondary shrink-0">
														{formatTimestamp(log.timestamp)}
													</span>
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
