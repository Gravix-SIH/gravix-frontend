"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderPinwheel } from "lucide-react";
import {
	Search,
	BookOpen,
	Video,
	FileText,
	Link2,
	Headphones,
	ExternalLink,
	RefreshCw,
	Filter,
	Clock,
	Star,
	Eye,
	EyeOff,
	BookMarked,
	TrendingUp,
} from "lucide-react";
import { counselorService, ResourceResponse } from "@/services/CounselorService";
import { toast } from "sonner";

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
	article: { icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50", label: "Article" },
	video: { icon: Video, color: "text-rose-600", bg: "bg-rose-50", label: "Video" },
	document: { icon: FileText, color: "text-amber-600", bg: "bg-amber-50", label: "Document" },
	link: { icon: Link2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Link" },
	audio: { icon: Headphones, color: "text-purple-600", bg: "bg-purple-50", label: "Audio" },
};

export default function CounsellorResources() {
	const [resources, setResources] = useState<ResourceResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [previewId, setPreviewId] = useState<string | null>(null);

	const fetchResources = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const data = await counselorService.getResources(
				categoryFilter && categoryFilter !== "__all__" ? categoryFilter : undefined
			);
			setResources(data);
		} catch (e: any) {
			setError(e.message);
			toast.error("Failed to load resources");
		} finally {
			setLoading(false);
		}
	}, [categoryFilter]);

	useEffect(() => {
		fetchResources();
	}, [fetchResources]);

	const filtered = resources.filter((r) => {
		const matchesSearch =
			search === "" ||
			r.title.toLowerCase().includes(search.toLowerCase()) ||
			(r.description || "").toLowerCase().includes(search.toLowerCase()) ||
			(r.category || "").toLowerCase().includes(search.toLowerCase());
		const matchesType = !typeFilter || typeFilter === "__all__" || r.type === typeFilter;
		const matchesCategory = !categoryFilter || categoryFilter === "__all__" || r.category === categoryFilter;
		return matchesSearch && matchesType && matchesCategory;
	});

	const categories = [...new Set(resources.map((r) => r.category).filter(Boolean))];

	const countsByType = resources.reduce((acc, r) => {
		acc[r.type] = (acc[r.type] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const totalCount = resources.length;

	return (
		<div className="p-4 sm:p-6 space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-bold">Resource Library</h2>
					<p className="text-sm text-text-secondary mt-0.5">Browse shared resources for student guidance</p>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={fetchResources}
					disabled={loading}
					className="h-9"
				>
					<RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
					Refresh
				</Button>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
				<Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white overflow-hidden relative">
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{totalCount}</p>
							<p className="text-xs text-indigo-100">Total Resources</p>
						</div>
						<div className="p-2.5 rounded-xl bg-white/20">
							<BookOpen className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
				{Object.entries(typeConfig).map(([type, config]) => {
					const TypeIcon = config.icon;
					const count = countsByType[type] || 0;
					return (
						<Card key={type} className="hover:shadow-md transition-shadow">
							<CardContent className="pt-4 flex items-center justify-between">
								<div>
									<p className="text-2xl font-bold">{count}</p>
									<p className="text-xs text-text-secondary">{config.label}s</p>
								</div>
								<div className={`p-2.5 rounded-xl ${config.bg}`}>
									<TypeIcon className={`w-4 h-4 ${config.color}`} />
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Quick Tips Card */}
			<Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
				<CardContent className="p-4">
					<div className="flex items-start gap-3">
						<div className="p-2 rounded-lg bg-amber-100">
							<TrendingUp className="w-5 h-5 text-amber-600" />
						</div>
						<div>
							<h4 className="font-medium text-sm">Sharing Resources with Students</h4>
							<p className="text-xs text-text-secondary mt-0.5">
								Use these resources during sessions or recommend them to students for self-guided learning.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base font-semibold">All Resources</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
								<Input
									placeholder="Search resources..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="pl-9 w-full sm:w-56 text-sm rounded-xl"
								/>
							</div>
							<Select value={typeFilter} onValueChange={setTypeFilter}>
								<SelectTrigger className="h-10 w-full sm:w-32 rounded-xl gap-2">
									<Filter className="w-4 h-4 text-text-secondary" />
									<SelectValue placeholder="Type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__all__">All Types</SelectItem>
									{Object.entries(typeConfig).map(([type, config]) => (
										<SelectItem key={type} value={type}>{config.label}</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select value={categoryFilter} onValueChange={setCategoryFilter}>
								<SelectTrigger className="h-10 w-full sm:w-40 rounded-xl gap-2">
									<BookMarked className="w-4 h-4 text-text-secondary" />
									<SelectValue placeholder="Category" />
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
						<div className="flex justify-center py-16">
							<div className="flex flex-col items-center gap-3">
								<LoaderPinwheel className="animate-spin w-8 h-8 text-indigo-500" />
								<p className="text-sm text-text-secondary">Loading resources...</p>
							</div>
						</div>
					) : error ? (
						<div className="text-center py-16">
							<div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
								<X className="w-6 h-6 text-red-500" />
							</div>
							<p className="text-red-500 text-sm">{error}</p>
						</div>
					) : filtered.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 gap-3">
							<div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
								<BookOpen className="w-8 h-8 text-indigo-400" />
							</div>
							<p className="text-text-secondary text-sm">
								{search || typeFilter || categoryFilter
									? "No resources match your filters"
									: "No resources available"}
							</p>
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{filtered.map((r) => {
								const cfg = typeConfig[r.type] || typeConfig.article;
								const TypeIcon = cfg.icon;
								const isPreview = previewId === r.id;

								return (
									<div
										key={r.id}
										className="group p-4 rounded-2xl border border-border/40 hover:border-border hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-background"
									>
										<div className="flex items-start gap-3">
											<div className={`p-3 rounded-xl ${cfg.bg} shrink-0 group-hover:scale-110 transition-transform`}>
												<TypeIcon className={`w-5 h-5 ${cfg.color}`} />
											</div>
											<div className="flex-1 min-w-0">
												<h4 className="text-sm font-semibold truncate group-hover:text-indigo-600 transition-colors">
													{r.title}
												</h4>
												<p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
													{r.description || "No description available"}
												</p>
												<div className="flex items-center gap-2 mt-2.5 flex-wrap">
													<Badge variant="outline" className="text-xs capitalize font-normal">
														{r.type}
													</Badge>
													{r.category && (
														<Badge className="text-xs bg-indigo-50 text-indigo-600 border-indigo-100 font-normal">
															{r.category}
														</Badge>
													)}
												</div>
											</div>
										</div>

										{(r.duration || r.rating) && (
											<div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/30">
												{r.duration && (
													<span className="flex items-center gap-1 text-xs text-text-secondary">
														<Clock className="w-3.5 h-3.5" />
														{r.duration}
													</span>
												)}
												{r.rating ? (
													<span className="flex items-center gap-1 text-xs text-amber-500">
														<Star className="w-3.5 h-3.5 fill-current" />
														{r.rating != null ? Number(r.rating).toFixed(1) : ''}
													</span>
												) : null}
											</div>
										)}

										<div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
											{isPreview ? (
												<>
													<a
														href={r.url}
														target="_blank"
														rel="noopener noreferrer"
														className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 transition-colors"
													>
														<ExternalLink className="w-3.5 h-3.5" />
														Open Resource
													</a>
													<button
														onClick={() => setPreviewId(null)}
														className="p-2 rounded-xl text-text-secondary hover:bg-gray-100 transition-colors"
													>
														<EyeOff className="w-4 h-4" />
													</button>
												</>
											) : (
												<>
													<button
														onClick={() => setPreviewId(r.id)}
														className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-text-secondary text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
													>
														<Eye className="w-3.5 h-3.5" />
														Preview
													</button>
													<a
														href={r.url}
														target="_blank"
														rel="noopener noreferrer"
														className="p-2 rounded-xl text-text-secondary hover:bg-gray-100 transition-colors"
													>
														<ExternalLink className="w-4 h-4" />
													</a>
												</>
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