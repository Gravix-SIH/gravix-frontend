"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	LoaderPinwheel,
	Search,
	BookOpen,
	Video,
	FileText,
	Link2,
	Headphones,
	ExternalLink,
	BookMarked,
} from "lucide-react";
import { counselorService, ResourceResponse } from "@/services/CounselorService";

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
	article: { icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
	video: { icon: Video, color: "text-rose-600", bg: "bg-rose-50" },
	document: { icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
	link: { icon: Link2, color: "text-emerald-600", bg: "bg-emerald-50" },
	audio: { icon: Headphones, color: "text-purple-600", bg: "bg-purple-50" },
};

export default function CounsellorResources() {
	const [resources, setResources] = useState<ResourceResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");

	const fetchResources = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const data = await counselorService.getResources(categoryFilter && categoryFilter !== "__all__" ? categoryFilter : undefined);
			setResources(data);
		} catch (e: any) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}, [categoryFilter]);

	useEffect(() => {
		fetchResources();
	}, [fetchResources]);

	const filtered = resources.filter(
		(r) =>
			search === "" ||
			r.title.toLowerCase().includes(search.toLowerCase()) ||
			(r.category || "").toLowerCase().includes(search.toLowerCase())
	);

	const categories = [...new Set(resources.map((r) => r.category).filter(Boolean))];

	return (
		<div className="p-4 sm:p-6 space-y-4">
			{/* Summary */}
			<div className="grid grid-cols-2 gap-4">
				<Card>
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{resources.length}</p>
							<p className="text-xs text-text-secondary">Total Resources</p>
						</div>
						<div className="p-2.5 rounded-xl bg-indigo-500">
							<BookOpen className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{categories.length}</p>
							<p className="text-xs text-text-secondary">Categories</p>
						</div>
						<div className="p-2.5 rounded-xl bg-emerald-500">
							<BookMarked className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">Shared Resources</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
								<Input
									placeholder="Search resources..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="pl-9 w-full sm:w-48 text-sm rounded-xl"
								/>
							</div>
							<Select value={categoryFilter} onValueChange={setCategoryFilter}>
								<SelectTrigger className="h-10 rounded-xl">
									<SelectValue placeholder="All Categories" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__all__">All Categories</SelectItem>
									{categories.map((c) => (
										<SelectItem key={c} value={c}>{c}</SelectItem>
									))}
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
					) : filtered.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 gap-2">
							<BookOpen className="w-8 h-8 text-text-secondary/50" />
							<p className="text-sm text-text-secondary">No resources found</p>
						</div>
					) : (
						<div className="grid gap-3 sm:grid-cols-2">
							{filtered.map((r) => {
								const cfg = typeConfig[r.type] || typeConfig.article;
								const TypeIcon = cfg.icon;
								return (
									<div
										key={r.id}
										className="p-4 rounded-2xl border border-border/40 hover:border-border/80 transition-all bg-gradient-to-br from-background to-background/80 group"
									>
										<div className="flex items-start gap-3">
											<div className={`p-2.5 rounded-xl ${cfg.bg} shrink-0`}>
												<TypeIcon className={`w-4 h-4 ${cfg.color}`} />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-semibold truncate">{r.title}</p>
												<p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
													{r.description || "No description"}
												</p>
												<div className="flex items-center gap-2 mt-2 flex-wrap">
													<span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-text-secondary capitalize">
														{r.type}
													</span>
													{r.category && (
														<span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
															{r.category}
														</span>
													)}
													{r.duration && (
														<span className="text-xs text-text-secondary">
															{r.duration}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
											<a
												href={r.url}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
											>
												<ExternalLink className="w-3.5 h-3.5" />
												Open Resource
											</a>
											{r.rating && (
												<span className="text-xs text-amber-500 ml-auto">
													★ {r.rating}
												</span>
											)}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
