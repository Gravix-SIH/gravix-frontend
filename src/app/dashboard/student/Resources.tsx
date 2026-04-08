"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Search,
	BookOpen,
	Video,
	FileText,
	Link2,
	Headphones,
	ExternalLink,
	RefreshCw,
	Clock,
	Star,
	Bookmark,
	BookmarkCheck,
	X,
	LoaderPinwheel,
	Sparkles,
} from "lucide-react";
import { studentService, ResourceResponse } from "@/services/studentService";
import { toast } from "sonner";

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
	article: { icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50", label: "Guide" },
	video: { icon: Video, color: "text-purple-600", bg: "bg-purple-50", label: "Video" },
	document: { icon: FileText, color: "text-amber-600", bg: "bg-amber-50", label: "Document" },
	link: { icon: Link2, color: "text-cyan-600", bg: "bg-cyan-50", label: "Tool" },
	audio: { icon: Headphones, color: "text-rose-600", bg: "bg-rose-50", label: "Audio" },
};

const categories = [
	{ id: "all", label: "All", icon: Sparkles, color: "text-gray-600" },
	{ id: "article", label: "Guides", icon: BookOpen, color: "text-emerald-600" },
	{ id: "video", label: "Videos", icon: Video, color: "text-purple-600" },
	{ id: "audio", label: "Audio", icon: Headphones, color: "text-rose-600" },
	{ id: "document", label: "Documents", icon: FileText, color: "text-amber-600" },
	{ id: "link", label: "Tools", icon: Link2, color: "text-cyan-600" },
];

interface ResourceModalProps {
	resource: ResourceResponse;
	onClose: () => void;
	onToggleBookmark: (id: string) => void;
	isBookmarked: boolean;
}

function ResourceModal({ resource, onClose, onToggleBookmark, isBookmarked }: ResourceModalProps) {
	const cfg = typeConfig[resource.type] || typeConfig.article;
	const IconComponent = cfg.icon;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
			<div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
				<div className={`h-2 bg-gradient-to-r ${cfg.bg.replace("50", "500")}`} />

				<div className="flex items-center justify-between p-4 border-b border-gray-100">
					<div className="flex items-center gap-3">
						<div className={`p-2.5 rounded-xl ${cfg.bg}`}>
							<IconComponent className={`w-5 h-5 ${cfg.color}`} />
						</div>
						<div>
							<h2 className="font-semibold text-gray-900">{resource.title}</h2>
							<div className="flex items-center gap-2 mt-0.5">
								<Badge variant="outline" className="text-xs capitalize">{resource.type}</Badge>
								{resource.category && (
									<Badge className="text-xs bg-indigo-50 text-indigo-600">{resource.category}</Badge>
								)}
								{resource.rating != null && (
									<span className="flex items-center text-xs text-amber-500">
										<Star className="w-3 h-3 mr-0.5 fill-current" />
										{Number(resource.rating).toFixed(1)}
									</span>
								)}
							</div>
						</div>
					</div>
					<button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				<div className="p-4 space-y-4">
					{resource.description && (
						<div>
							<h4 className="text-sm font-medium text-text-secondary mb-1.5">Description</h4>
							<p className="text-sm text-gray-700 leading-relaxed">{resource.description}</p>
						</div>
					)}

					{resource.duration && (
						<div className="flex items-center gap-2 text-sm text-text-secondary">
							<Clock className="w-4 h-4" />
							<span>{resource.duration}</span>
						</div>
					)}

					<div className="flex gap-3">
						<a
							href={resource.url}
							target="_blank"
							rel="noopener noreferrer"
							className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium text-sm"
						>
							<ExternalLink className="w-4 h-4" />
							Open Resource
						</a>
						<Button
							variant="outline"
							onClick={() => onToggleBookmark(resource.id)}
							className={`px-3 ${isBookmarked ? "text-purple-600 border-purple-200 bg-purple-50" : ""}`}
						>
							{isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function StudentResources() {
	const [activeCategory, setActiveCategory] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [resources, setResources] = useState<ResourceResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [selectedResource, setSelectedResource] = useState<ResourceResponse | null>(null);
	const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

	const loadResources = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const [allResources, bookmarked] = await Promise.all([
				studentService.getResources(),
				studentService.getBookmarkedResources()
			]);
			setResources(allResources);
			setBookmarkedIds(new Set(bookmarked.map((r: ResourceResponse) => r.id)));
		} catch (e: any) {
			setError(e.message);
			toast.error("Failed to load resources");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadResources();
	}, [loadResources]);

	const toggleBookmark = async (resourceId: string) => {
		// Optimistically update UI
		setBookmarkedIds((prev) => {
			const next = new Set(prev);
			const isCurrentlyBookmarked = next.has(resourceId);
			if (isCurrentlyBookmarked) {
				next.delete(resourceId);
				toast.success("Removed from bookmarks");
			} else {
				next.add(resourceId);
				toast.success("Added to bookmarks");
			}
			return next;
		});

		try {
			// Try to sync with server if endpoints exist
			if (bookmarkedIds.has(resourceId)) {
				await studentService.removeBookmark(resourceId);
			} else {
				await studentService.bookmarkResource(resourceId);
			}
		} catch {
			// Revert on failure (server endpoints may not exist)
			setBookmarkedIds((prev) => {
				const next = new Set(prev);
				if (prev.has(resourceId)) {
					next.delete(resourceId);
				} else {
					next.add(resourceId);
				}
				return next;
			});
			toast.error("Bookmark update failed - using local storage");
		}
	};

	const filteredResources = resources.filter((r) => {
		const matchesCategory = activeCategory === "all" || r.type === activeCategory;
		if (!matchesCategory) return false;

		if (searchTerm) {
			const search = searchTerm.toLowerCase();
			if (
				!r.title.toLowerCase().includes(search) &&
				!r.description?.toLowerCase().includes(search) &&
				!r.category?.toLowerCase().includes(search)
			) {
				return false;
			}
		}
		return true;
	});

	const countsByType = resources.reduce((acc, r) => {
		acc[r.type] = (acc[r.type] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const bookmarkedCount = bookmarkedIds.size;

	return (
		<div className="p-4 sm:p-6 space-y-4">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
						Wellness Resources
					</h1>
					<p className="text-text-secondary text-sm mt-1">
						Curated guides, videos, and tools for your mental health journey
					</p>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={loadResources}
					disabled={loading}
					className="h-9"
				>
					<RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
					Refresh
				</Button>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{resources.length}</p>
							<p className="text-xs text-purple-100">Total Resources</p>
						</div>
						<div className="p-2.5 rounded-xl bg-white/20">
							<BookOpen className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-md transition-shadow">
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{bookmarkedCount}</p>
							<p className="text-xs text-text-secondary">Saved</p>
						</div>
						<div className="p-2.5 rounded-xl bg-purple-50">
							<Bookmark className="w-4 h-4 text-purple-600" />
						</div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-md transition-shadow">
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{countsByType.video || 0}</p>
							<p className="text-xs text-text-secondary">Videos</p>
						</div>
						<div className="p-2.5 rounded-xl bg-purple-50">
							<Video className="w-4 h-4 text-purple-600" />
						</div>
					</CardContent>
				</Card>
				<Card className="hover:shadow-md transition-shadow">
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{countsByType.article || 0}</p>
							<p className="text-xs text-text-secondary">Guides</p>
						</div>
						<div className="p-2.5 rounded-xl bg-emerald-50">
							<BookOpen className="w-4 h-4 text-emerald-600" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Search & Filter Card */}
			<Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
				<CardContent className="p-4">
					<div className="flex flex-col lg:flex-row gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<Input
								placeholder="Search resources by title, description, or category..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 h-11 rounded-xl text-sm"
							/>
						</div>
						<div className="flex flex-wrap gap-2">
							{categories.map((cat) => {
								const IconComponent = cat.icon;
								const count = cat.id === "all" ? resources.length : countsByType[cat.id] || 0;
								const isActive = activeCategory === cat.id;
								return (
									<Button
										key={cat.id}
										variant={isActive ? "default" : "outline"}
										size="sm"
										onClick={() => setActiveCategory(cat.id)}
										className={`h-9 text-xs ${
											isActive
												? "bg-purple-500 hover:bg-purple-600"
												: "text-text-secondary border-gray-200"
										}`}
									>
										<IconComponent className={`w-3.5 h-3.5 mr-1.5 ${isActive ? "text-white" : cat.color}`} />
										{cat.label}
										<span className={`ml-1.5 opacity-60 ${isActive ? "text-white/80" : ""}`}>
											({count})
										</span>
									</Button>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Resources Grid */}
			{loading ? (
				<div className="flex items-center justify-center py-20">
					<div className="flex flex-col items-center gap-4">
						<LoaderPinwheel className="animate-spin w-10 h-10 text-purple-500" />
						<p className="text-text-secondary text-sm">Loading resources...</p>
					</div>
				</div>
			) : error ? (
				<Card className="border-0 shadow-lg">
					<CardContent className="py-16 text-center">
						<div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
							<X className="w-7 h-7 text-red-500" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to Load</h3>
						<p className="text-sm text-text-secondary mb-4">{error}</p>
						<Button onClick={loadResources} variant="outline" className="rounded-xl">
							<RefreshCw className="w-4 h-4 mr-2" />
							Try Again
						</Button>
					</CardContent>
				</Card>
			) : filteredResources.length === 0 ? (
				<Card className="border-0 shadow-lg">
					<CardContent className="py-16 text-center">
						<div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
							<BookOpen className="w-8 h-8 text-purple-400" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-1">
							{searchTerm ? "No Results Found" : "No Resources Available"}
						</h3>
						<p className="text-sm text-text-secondary max-w-sm mx-auto">
							{searchTerm
								? `No resources match "${searchTerm}". Try a different search term.`
								: "Resources will appear here once administrators add them."}
						</p>
						{searchTerm && (
							<Button
								onClick={() => setSearchTerm("")}
								variant="outline"
								className="mt-4 rounded-xl"
							>
								Clear Search
							</Button>
						)}
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filteredResources.map((resource) => {
						const cfg = typeConfig[resource.type] || typeConfig.article;
						const IconComponent = cfg.icon;
						const isBookmarked = bookmarkedIds.has(resource.id);

						return (
							<Card
								key={resource.id}
								className="group border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
								onClick={() => setSelectedResource(resource)}
							>
								<div className={`h-1.5 bg-gradient-to-r ${cfg.bg.replace("50", "500")}`} />

								<CardContent className="p-4">
									<div className="flex items-start justify-between mb-3">
										<div className={`p-2.5 rounded-xl ${cfg.bg} group-hover:scale-110 transition-transform duration-300`}>
											<IconComponent className={`w-5 h-5 ${cfg.color}`} />
										</div>
										<button
											onClick={(e) => {
												e.stopPropagation();
												toggleBookmark(resource.id);
											}}
											className={`p-1.5 rounded-lg transition-all duration-200 ${
												isBookmarked
													? "text-purple-600 bg-purple-50"
													: "text-gray-300 hover:text-purple-600 hover:bg-purple-50"
											}`}
										>
											{isBookmarked ? (
												<BookmarkCheck className="w-5 h-5" />
											) : (
												<Bookmark className="w-5 h-5" />
											)}
										</button>
									</div>

									<h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-purple-600 transition-colors">
										{resource.title}
									</h3>

									{resource.description && (
										<p className="text-xs text-text-secondary mb-3 line-clamp-2 leading-relaxed">
											{resource.description}
										</p>
									)}

									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Badge variant="outline" className="text-xs capitalize font-normal">
												{cfg.label}
											</Badge>
											{resource.category && (
												<Badge className="text-xs bg-gray-100 text-text-secondary font-normal">
													{resource.category}
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-2">
											{resource.rating && (
												<span className="flex items-center text-xs text-amber-500">
													<Star className="w-3.5 h-3.5 mr-0.5 fill-current" />
													{resource.rating != null ? Number(resource.rating).toFixed(1) : ''}
												</span>
											)}
											{resource.duration && (
												<span className="flex items-center text-xs text-text-secondary">
													<Clock className="w-3 h-3 mr-0.5" />
													{resource.duration}
												</span>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			{/* Resource Count Summary */}
			{!loading && filteredResources.length > 0 && (
				<div className="text-center text-sm text-text-secondary">
					Showing {filteredResources.length} of {resources.length} resources
					{activeCategory !== "all" && " in "}
					{activeCategory !== "all" && (
						<span className="font-medium text-purple-600">
							{categories.find((c) => c.id === activeCategory)?.label}
						</span>
					)}
				</div>
			)}

			{/* Resource Detail Modal */}
			{selectedResource && (
				<ResourceModal
					resource={selectedResource}
					onClose={() => setSelectedResource(null)}
					onToggleBookmark={toggleBookmark}
					isBookmarked={bookmarkedIds.has(selectedResource.id)}
				/>
			)}
		</div>
	);
}