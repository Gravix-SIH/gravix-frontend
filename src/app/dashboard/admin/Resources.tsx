"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderPinwheel } from "lucide-react";
import {
	Search,
	Plus,
	Edit3,
	Trash2,
	ExternalLink,
	BookOpen,
	Video,
	FileText,
	Link2,
	Headphones,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import {
	adminService,
	AdminResource,
	ResourceFilters,
} from "@/services/adminService";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 8;

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
	article: { icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
	video: { icon: Video, color: "text-rose-600", bg: "bg-rose-50" },
	document: { icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
	link: { icon: Link2, color: "text-emerald-600", bg: "bg-emerald-50" },
	audio: { icon: Headphones, color: "text-purple-600", bg: "bg-purple-50" },
};

export default function AdminResources() {
	const [resources, setResources] = useState<AdminResource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [page, setPage] = useState(1);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [editingResource, setEditingResource] = useState<AdminResource | null>(null);
	const [newResource, setNewResource] = useState(false);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		type: "article" as "article" | "video" | "document" | "link" | "audio",
		url: "",
		category: "",
	});

	const fetchResources = useCallback(async (filters?: ResourceFilters) => {
		setLoading(true);
		setError("");
		try {
			const data = await adminService.getResources(filters);
			setResources(data);
		} catch (e: any) {
			setError(e.message);
			toast.error("Failed to load resources");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchResources({ category: categoryFilter && categoryFilter !== "__all__" ? categoryFilter : undefined });
	}, [fetchResources, categoryFilter]);

	const filtered = resources.filter(
		(r) =>
			search === "" ||
			r.title.toLowerCase().includes(search.toLowerCase()) ||
			(r.category || "").toLowerCase().includes(search.toLowerCase())
	);

	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);

	const handleDelete = async (id: string) => {
		setActionLoading(id);
		try {
			await adminService.deleteResource(id);
			setDeleteConfirm(null);
			toast.success("Resource deleted");
			fetchResources({ category: categoryFilter && categoryFilter !== "__all__" ? categoryFilter : undefined });
		} catch (e: any) {
			toast.error("Failed to delete: " + e.message);
		} finally {
			setActionLoading(null);
		}
	};

	const handleCreate = async () => {
		setActionLoading("create");
		try {
			await adminService.createResource(formData);
			setNewResource(false);
			setFormData({
				title: "",
				description: "",
				type: "article",
				url: "",
				category: "",
			});
			toast.success("Resource created");
			fetchResources({ category: categoryFilter && categoryFilter !== "__all__" ? categoryFilter : undefined });
		} catch (e: any) {
			toast.error("Failed to create: " + e.message);
		} finally {
			setActionLoading(null);
		}
	};

	const handleUpdate = async (id: string) => {
		setActionLoading(id);
		try {
			await adminService.updateResource(id, formData);
			setEditingResource(null);
			setFormData({
				title: "",
				description: "",
				type: "article",
				url: "",
				category: "",
			});
			toast.success("Resource updated");
			fetchResources({ category: categoryFilter && categoryFilter !== "__all__" ? categoryFilter : undefined });
		} catch (e: any) {
			toast.error("Failed to update: " + e.message);
		} finally {
			setActionLoading(null);
		}
	};

	const startEdit = (r: AdminResource) => {
		setEditingResource(r);
		setFormData({
			title: r.title,
			description: r.description || "",
			type: r.type,
			url: r.url,
			category: r.category || "",
		});
	};

	const startNew = () => {
		setNewResource(true);
		setFormData({ title: "", description: "", type: "article", url: "", category: "" });
	};

	const categories = [...new Set(resources.map((r) => r.category).filter(Boolean))];

	const renderForm = () => (
		<div className="p-4 border border-border/60 rounded-2xl bg-gradient-to-br from-background to-background/80 space-y-3 mb-4">
			<Input
				placeholder="Resource title"
				value={formData.title}
				onChange={(e) => setFormData({ ...formData, title: e.target.value })}
				className="rounded-xl"
			/>
			<Input
				placeholder="Description"
				value={formData.description}
				onChange={(e) => setFormData({ ...formData, description: e.target.value })}
				className="rounded-xl"
			/>
			<div className="grid grid-cols-2 gap-2">
				<Select
					value={formData.type}
					onValueChange={(v) => setFormData({ ...formData, type: v as typeof formData.type })}
				>
					<SelectTrigger className="h-11 rounded-xl">
						<SelectValue placeholder="Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="article">Article</SelectItem>
						<SelectItem value="video">Video</SelectItem>
						<SelectItem value="document">Document</SelectItem>
						<SelectItem value="link">Link</SelectItem>
						<SelectItem value="audio">Audio</SelectItem>
					</SelectContent>
				</Select>
				<Input
					placeholder="Category"
					value={formData.category}
					onChange={(e) => setFormData({ ...formData, category: e.target.value })}
					className="rounded-xl"
				/>
			</div>
			<Input
				placeholder="URL"
				value={formData.url}
				onChange={(e) => setFormData({ ...formData, url: e.target.value })}
				className="rounded-xl"
			/>
			<div className="flex gap-2">
				<button
					className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50"
					onClick={() =>
						editingResource ? handleUpdate(editingResource.id) : handleCreate()
					}
					disabled={actionLoading !== null}
				>
					{actionLoading !== null ? "Saving..." : editingResource ? "Update" : "Create"}
				</button>
				<button
					className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:bg-gray-100 transition-colors"
					onClick={() => {
						setEditingResource(null);
						setNewResource(false);
					}}
				>
					Cancel
				</button>
			</div>
		</div>
	);

	return (
		<div className="p-4 sm:p-6 space-y-4">
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
							<FileText className="w-4 h-4 text-white" />
						</div>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base">Resources</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
								<Input
									placeholder="Search resources..."
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
										setPage(1);
									}}
									className="pl-9 w-full sm:w-48 text-sm rounded-xl"
								/>
							</div>
							<Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
								<SelectTrigger className="h-10 w-full sm:w-40 rounded-xl">
									<SelectValue placeholder="All Categories" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__all__">All Categories</SelectItem>
									{categories.map((c) => (
										<SelectItem key={c} value={c}>{c}</SelectItem>
									))}
								</SelectContent>
							</Select>
							<button
								className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
								onClick={startNew}
							>
								<Plus className="w-4 h-4" />
								Add Resource
							</button>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{(newResource || editingResource) && renderForm()}

					{loading ? (
						<div className="flex justify-center py-12">
							<LoaderPinwheel className="animate-spin w-6 h-6 text-muted-foreground" />
						</div>
					) : error ? (
						<div className="text-center py-12 text-red-500 text-sm">{error}</div>
					) : paginated.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 gap-2">
							<BookOpen className="w-8 h-8 text-text-secondary/50" />
							<p className="text-sm text-text-secondary">No resources found</p>
						</div>
					) : (
						<>
							<div className="grid gap-3 sm:grid-cols-2">
								{paginated.map((r) => {
									const cfg = typeConfig[r.type] || typeConfig.article;
									const TypeIcon = cfg.icon;
									return (
										<div
											key={r.id}
											className="p-4 rounded-2xl border border-border/40 hover:border-border/80 transition-all bg-gradient-to-br from-background to-background/80 group"
										>
											<div className="flex items-start gap-3">
												<div
													className={`p-2.5 rounded-xl ${cfg.bg} shrink-0`}
												>
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
													Open
												</a>
												<div className="flex-1" />
												{editingResource?.id !== r.id && (
													<>
														<button
															className="p-1.5 rounded-lg text-text-secondary hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
															onClick={() => startEdit(r)}
														>
															<Edit3 className="w-4 h-4" />
														</button>
														{deleteConfirm === r.id ? (
															<>
																<button
																	className="px-2 py-1 rounded-lg text-xs font-medium bg-rose-500 text-white"
																	onClick={() => handleDelete(r.id)}
																>
																	Confirm
																</button>
																<button
																	className="px-2 py-1 rounded-lg text-xs text-text-secondary hover:bg-gray-100"
																	onClick={() => setDeleteConfirm(null)}
																>
																	Cancel
																</button>
															</>
														) : (
															<button
																className="p-1.5 rounded-lg text-text-secondary hover:bg-rose-50 hover:text-rose-500 transition-colors"
																onClick={() => setDeleteConfirm(r.id)}
															>
																<Trash2 className="w-4 h-4" />
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
