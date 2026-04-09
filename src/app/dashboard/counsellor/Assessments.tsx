"use client";

import React from "react";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	LoaderPinwheel,
	Brain,
	Heart,
	Moon,
	Calendar,
	Eye,
} from "lucide-react";
import {
	counselorService,
	CounselorAssessment,
} from "@/services/CounselorService";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const typeConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
	phq9: {
		icon: Brain,
		color: "text-red-600",
		bg: "bg-red-50",
		label: "PHQ-9 Depression",
	},
	gad7: {
		icon: Heart,
		color: "text-blue-600",
		bg: "bg-blue-50",
		label: "GAD-7 Anxiety",
	},
	psqi: {
		icon: Moon,
		color: "text-purple-600",
		bg: "bg-purple-50",
		label: "PSQI Sleep",
	},
};

export default function CounsellorAssessments() {
	const [assessments, setAssessments] = useState<CounselorAssessment[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [severityFilter, setSeverityFilter] = useState("");
	const [page, setPage] = useState(1);
	const [selected, setSelected] = useState<CounselorAssessment | null>(null);

	const fetchAssessments = useCallback(
		async (params?: { assessment_type?: string; severity?: string }) => {
			setLoading(true);
			setError("");
			try {
				const data = await counselorService.getAssessments(params);
				setAssessments(data);
			} catch (e) {
				setError(e instanceof Error ? e.message : "Failed to load assessments");
				toast.error("Failed to load assessments");
			} finally {
				setLoading(false);
			}
		},
		[]
	);

	useEffect(() => {
		fetchAssessments({
			assessment_type: typeFilter && typeFilter !== "__all__" ? typeFilter : undefined,
			severity: severityFilter && severityFilter !== "__all__" ? severityFilter : undefined,
		});
	}, [fetchAssessments, typeFilter, severityFilter]);

	const filtered = assessments.filter((a) => {
		if (typeFilter && typeFilter !== "__all__" && a.assessment_type !== typeFilter) return false;
		if (severityFilter && severityFilter !== "__all__" && !a.severity.toLowerCase().includes(severityFilter.toLowerCase()))
			return false;
		return true;
	});

	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);

	// Summary counts
	const byType = {
		phq9: assessments.filter((a) => a.assessment_type === "phq9").length,
		gad7: assessments.filter((a) => a.assessment_type === "gad7").length,
		psqi: assessments.filter((a) => a.assessment_type === "psqi").length,
	};

	const avgScore = (type: string) => {
		const items = assessments.filter((a) => a.assessment_type === type);
		if (!items.length) return 0;
		return (items.reduce((s, a) => s + a.score, 0) / items.length).toFixed(1);
	};

	interface SeverityBadgeProps {
		severity: string;
	}

	function SeverityBadge({ severity }: SeverityBadgeProps) {
		const variant = severity.toLowerCase().replace(/\s+/g, "-") as Parameters<typeof Badge>[0]['variant'];
		return <Badge variant={variant}>{severity}</Badge>;
	}

	return (
		<div className="p-4 sm:p-6 space-y-4">
			{/* Summary Cards */}
			<div className="grid grid-cols-3 gap-4">
				{[
					{ id: "phq9", label: "PHQ-9", count: byType.phq9, avg: avgScore("phq9"), icon: Brain, color: "bg-red-500" },
					{ id: "gad7", label: "GAD-7", count: byType.gad7, avg: avgScore("gad7"), icon: Heart, color: "bg-blue-500" },
					{ id: "psqi", label: "PSQI", count: byType.psqi, avg: avgScore("psqi"), icon: Moon, color: "bg-purple-500" },
				].map((t) => (
					<Card key={t.id}>
						<CardContent className="pt-4 flex items-center justify-between">
							<div>
								<p className="text-2xl font-bold">{t.count}</p>
								<p className="text-xs text-text-secondary">{t.label} submissions</p>
								<p className="text-xs text-text-secondary">Avg: {t.avg}</p>
							</div>
							<div className={`p-2.5 rounded-xl ${t.color}`}>
								<t.icon className="w-4 h-4 text-white" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">Student Assessments</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2">
							<Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
								<SelectTrigger className="h-10 rounded-xl">
									<SelectValue placeholder="All Types" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__all__">All Types</SelectItem>
									<SelectItem value="phq9">PHQ-9</SelectItem>
									<SelectItem value="gad7">GAD-7</SelectItem>
									<SelectItem value="psqi">PSQI</SelectItem>
								</SelectContent>
							</Select>
							<Select value={severityFilter} onValueChange={(v) => { setSeverityFilter(v); setPage(1); }}>
								<SelectTrigger className="h-10 rounded-xl">
									<SelectValue placeholder="All Severity" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__all__">All Severity</SelectItem>
									<SelectItem value="Minimal">Minimal</SelectItem>
									<SelectItem value="Mild">Mild</SelectItem>
									<SelectItem value="Moderate">Moderate</SelectItem>
									<SelectItem value="Severe">Severe</SelectItem>
									<SelectItem value="Moderately Severe">Moderately Severe</SelectItem>
									<SelectItem value="Good">Good</SelectItem>
									<SelectItem value="Fair">Fair</SelectItem>
									<SelectItem value="Poor">Poor</SelectItem>
									<SelectItem value="Very Poor">Very Poor</SelectItem>
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
							<Brain className="w-8 h-8 text-text-secondary/50" />
							<p className="text-sm text-text-secondary">No assessments found</p>
						</div>
					) : (
						<>
							<div className="space-y-2">
								{paginated.map((a) => {
									const cfg = typeConfig[a.assessment_type] || typeConfig.phq9;
									const TypeIcon = cfg.icon;
									return (
										<div
											key={a.id}
											className="flex items-center justify-between p-4 rounded-2xl border border-border/40 hover:border-border/80 transition-all bg-gradient-to-br from-background to-background/80 gap-4"
										>
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<div className={`p-2.5 rounded-xl ${cfg.bg} shrink-0`}>
													<TypeIcon className={`w-4 h-4 ${cfg.color}`} />
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 flex-wrap">
														<p className="text-sm font-semibold">
															{a.user_name || a.user_email || "Anonymous Student"}
														</p>
														<SeverityBadge severity={a.severity} />
													</div>
													<div className="flex items-center gap-3 mt-0.5">
														<span className="text-xs text-text-secondary">
															{cfg.label}
														</span>
														<span className="text-xs text-text-secondary flex items-center gap-1">
															<Calendar className="w-3 h-3" />
															{new Date(a.created_at).toLocaleDateString()}
														</span>
													</div>
												</div>
											</div>

											<div className="flex items-center gap-3 shrink-0">
												{/* Score */}
												<div className="text-right">
													<p className="text-sm font-bold">{a.score}/{a.max_score}</p>
													<p className="text-xs text-text-secondary">Score</p>
												</div>
												<button
													className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
													onClick={() => setSelected(a)}
												>
													<Eye className="w-4 h-4" />
												</button>
											</div>
										</div>
									);
								})}
							</div>

							{totalPages > 1 && (
								<div className="flex items-center justify-between mt-4 pt-4 border-t">
									<p className="text-xs text-text-secondary">
										Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
										{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
									</p>
									<div className="flex items-center gap-2">
										<button
											className="p-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
											disabled={page === 1}
											onClick={() => setPage(page - 1)}
										>
											←
										</button>
										<span className="text-xs font-medium">{page} / {totalPages}</span>
										<button
											className="p-1.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50"
											disabled={page === totalPages}
											onClick={() => setPage(page + 1)}
										>
											→
										</button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			{/* Detail Modal */}
			{selected && (
				<div
					className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
					onClick={() => setSelected(null)}
				>
					<div
						className="bg-background rounded-2xl p-6 max-w-md w-full shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-start justify-between mb-4">
							<div>
								<h3 className="font-semibold">{selected.user_name || selected.user_email}</h3>
								<p className="text-sm text-text-secondary">{typeConfig[selected.assessment_type]?.label}</p>
							</div>
							<SeverityBadge severity={selected.severity} />
						</div>
						<div className="space-y-2 mb-4">
							<div className="flex justify-between text-sm">
								<span className="text-text-secondary">Score</span>
								<span className="font-bold">{selected.score} / {selected.max_score}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-text-secondary">Submitted</span>
								<span>{new Date(selected.created_at).toLocaleString()}</span>
							</div>
						</div>
						{selected.answers.length > 0 && (
							<div>
								<p className="text-xs font-medium text-text-secondary mb-2">Responses</p>
								<div className="flex gap-2 flex-wrap">
									{selected.answers.map((ans, i) => (
										<span key={i} className="px-2 py-1 rounded-lg bg-gray-100 text-xs font-mono">
											Q{i + 1}: {ans}
										</span>
									))}
								</div>
							</div>
						)}
						<button
							className="mt-4 w-full py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
							onClick={() => setSelected(null)}
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
