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
	Filter,
	RefreshCw,
	X,
	Eye,
	EyeOff,
	Clock,
	Star,
	BookMarked,
} from "lucide-react";
import {
	adminService,
	AdminResource,
	ResourceFilters,
} from "@/services/adminService";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 9;

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
	article: { icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-50", label: "Article" },
	video: { icon: Video, color: "text-rose-600", bg: "bg-rose-50", label: "Video" },
	document: { icon: FileText, color: "text-amber-600", bg: "bg-amber-50", label: "Document" },
	link: { icon: Link2, color: "text-emerald-600", bg: "bg-emerald-50", label: "Link" },
	audio: { icon: Headphones, color: "text-purple-600", bg: "bg-purple-50", label: "Audio" },
};

interface FormData {
	title: string;
	description: string;
	type: "article" | "video" | "document" | "link" | "audio";
	url: string;
	category: string;
	duration: string;
	rating: string;
}

const defaultFormData: FormData = {
	title: "",
	description: "",
	type: "article",
	url: "",
	category: "",
	duration: "",
	rating: "",
};

const validateForm = (data: FormData): { valid: boolean; errors: Record<string, string> } => {
	const errors: Record<string, string> = {};

	if (!data.title.trim()) {
		errors.title = "Title is required";
	} else if (data.title.length < 3) {
		errors.title = "Title must be at least 3 characters";
	}

	if (!data.url.trim()) {
		errors.url = "URL is required";
	} else {
		try {
			new URL(data.url);
		} catch {
			errors.url = "Please enter a valid URL";
		}
	}

	if (data.duration && !/^\d+(\s*(min|minutes?|hrs?|hours?))?$/i.test(data.duration.trim())) {
		errors.duration = "Duration format: e.g., '5 min', '1 hour'";
	}

	if (data.rating && (isNaN(Number(data.rating)) || Number(data.rating) < 0 || Number(data.rating) > 5)) {
		errors.rating = "Rating must be between 0 and 5";
	}

	return { valid: Object.keys(errors).length === 0, errors };
};

export default function AdminResources() {
	const [resources, setResources] = useState<AdminResource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [page, setPage] = useState(1);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
	const [editingResource, setEditingResource] = useState<AdminResource | null>(null);
	const [isCreating, setIsCreating] = useState(false);
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [formData, setFormData] = useState<FormData>(defaultFormData);
	const [showPreview, setShowPreview] = useState<string | null>(null);

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
		const filters: ResourceFilters = {};
		if (categoryFilter && categoryFilter !== "__all__") filters.category = categoryFilter;
		fetchResources(filters);
	}, [fetchResources, categoryFilter]);

	const filtered = resources.filter((r) => {
		const matchesSearch =
			search === "" ||
			r.title.toLowerCase().includes(search.toLowerCase()) ||
			(r.category || "").toLowerCase().includes(search.toLowerCase()) ||
			(r.description || "").toLowerCase().includes(search.toLowerCase());
		const matchesType = !typeFilter || typeFilter === "__all__" || r.type === typeFilter;
		return matchesSearch && matchesType;
	});

	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

	const categories = [...new Set(resources.map((r) => r.category).filter(Boolean))];

	const countsByType = resources.reduce((acc, r) => {
		acc[r.type] = (acc[r.type] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const handleDelete = async (id: string) => {
		setActionLoading(id);
		try {
			await adminService.deleteResource(id);
			setDeleteConfirmId(null);
			toast.success("Resource deleted successfully");
			fetchResources({ category: categoryFilter && categoryFilter !== "__all__" ? categoryFilter : undefined });
		} catch (e: any) {
			toast.error("Failed to delete: " + e.message);
		} finally {
			setActionLoading(null);
		}
	};

	const handleSubmit = async () => {
		const { valid, errors } = validateForm(formData);
		if (!valid) {
			setFormErrors(errors);
			return;
		}
		setFormErrors({});

		setActionLoading(editingResource ? editingResource.id : "create");
		try {
			const payload = {
				title: formData.title.trim(),
				description: formData.description.trim() || undefined,
				type: formData.type,
				url: formData.url.trim(),
				category: formData.category.trim() || undefined,
				duration: formData.duration.trim() || undefined,
				rating: formData.rating ? Number(formData.rating) : undefined,
			};

			if (editingResource) {
				await adminService.updateResource(editingResource.id, payload);
				toast.success("Resource updated successfully");
			} else {
				await adminService.createResource(payload);
				toast.success("Resource created successfully");
			}

			closeForm();
			fetchResources({ category: categoryFilter && categoryFilter !== "__all__" ? categoryFilter : undefined });
		} catch (e: any) {
			toast.error("Failed to save: " + e.message);
		} finally {
			setActionLoading(null);
		}
	};

	const startEdit = (r: AdminResource) => {
		setEditingResource(r);
		setIsCreating(false);
		setFormData({
			title: r.title,
			description: r.description || "",
			type: r.type,
			url: r.url,
			category: r.category || "",
			duration: r.duration || "",
			rating: r.rating ? String(r.rating) : "",
		});
		setFormErrors({});
	};

	const startCreate = () => {
		setIsCreating(true);
		setEditingResource(null);
		setFormData(defaultFormData);
		setFormErrors({});
	};

	const closeForm = () => {
		setIsCreating(false);
		setEditingResource(null);
		setFormData(defaultFormData);
		setFormErrors({});
	};

	return (
		<div className="p-4 sm:p-6 space-y-4">
			{/* Summary Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
				<Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
					<CardContent className="pt-4 flex items-center justify-between">
						<div>
							<p className="text-2xl font-bold">{resources.length}</p>
							<p className="text-xs text-indigo-100">Total</p>
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

			<Card>
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<CardTitle className="text-base font-semibold">Resource Library</CardTitle>
						<div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => fetchResources()}
								disabled={loading}
								className="h-9 w-9 p-0"
							>
								<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
							</Button>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
								<Input
									placeholder="Search resources..."
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
										setPage(1);
									}}
									className="pl-9 w-full sm:w-56 text-sm rounded-xl"
								/>
							</div>
							<Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
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
							<Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
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
							<Button onClick={startCreate} className="bg-indigo-500 hover:bg-indigo-600 rounded-xl">
								<Plus className="w-4 h-4 mr-1" />
								Add Resource
							</Button>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					{/* Create/Edit Form Modal */}
					{(isCreating || editingResource) && (
						<div className="mb-6 p-5 border-2 border-indigo-100 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-white space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-lg">
									{editingResource ? "Edit Resource" : "Create New Resource"}
								</h3>
								<button onClick={closeForm} className="p-1.5 hover:bg-indigo-100 rounded-lg transition-colors">
									<X className="w-5 h-5 text-text-secondary" />
								</button>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								<div className="lg:col-span-2">
									<label className="text-sm font-medium text-text-secondary mb-1.5 block">Title *</label>
									<Input
										placeholder="e.g., Introduction to Mindfulness"
										value={formData.title}
										onChange={(e) => {
											setFormData({ ...formData, title: e.target.value });
											if (formErrors.title) setFormErrors({ ...formErrors, title: "" });
										}}
										className={`rounded-xl ${formErrors.title ? "border-red-500 ring-1 ring-red-200" : ""}`}
									/>
									{formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
								</div>

								<div>
									<label className="text-sm font-medium text-text-secondary mb-1.5 block">URL *</label>
									<Input
										placeholder="https://..."
										type="url"
										value={formData.url}
										onChange={(e) => {
											setFormData({ ...formData, url: e.target.value });
											if (formErrors.url) setFormErrors({ ...formErrors, url: "" });
										}}
										className={`rounded-xl ${formErrors.url ? "border-red-500 ring-1 ring-red-200" : ""}`}
									/>
									{formErrors.url && <p className="text-xs text-red-500 mt-1">{formErrors.url}</p>}
								</div>

								<div className="sm:col-span-2">
									<label className="text-sm font-medium text-text-secondary mb-1.5 block">Description</label>
									<Input
										placeholder="Brief description of this resource..."
										value={formData.description}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										className="rounded-xl"
									/>
								</div>

								<div className="grid grid-cols-3 gap-3">
									<div>
										<label className="text-sm font-medium text-text-secondary mb-1.5 block">Type</label>
										<Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as FormData["type"] })}>
											<SelectTrigger className="h-10 rounded-xl">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(typeConfig).map(([type, config]) => (
													<SelectItem key={type} value={type}>{config.label}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div>
										<label className="text-sm font-medium text-text-secondary mb-1.5 block">Category</label>
										<Input
											placeholder="e.g., Wellness"
											value={formData.category}
											onChange={(e) => setFormData({ ...formData, category: e.target.value })}
											className="rounded-xl h-10"
										/>
									</div>
									<div>
										<label className="text-sm font-medium text-text-secondary mb-1.5 block">Duration</label>
										<Input
											placeholder="e.g., 10 min"
											value={formData.duration}
											onChange={(e) => {
												setFormData({ ...formData, duration: e.target.value });
												if (formErrors.duration) setFormErrors({ ...formErrors, duration: "" });
											}}
											className={`rounded-xl h-10 ${formErrors.duration ? "border-red-500 ring-1 ring-red-200" : ""}`}
										/>
									</div>
								</div>

								<div>
									<label className="text-sm font-medium text-text-secondary mb-1.5 block">Rating (0-5)</label>
									<Input
										placeholder="e.g., 4.5"
										type="number"
										min="0"
										max="5"
										step="0.1"
										value={formData.rating}
										onChange={(e) => {
											setFormData({ ...formData, rating: e.target.value });
											if (formErrors.rating) setFormErrors({ ...formErrors, rating: "" });
										}}
										className={`rounded-xl ${formErrors.rating ? "border-red-500 ring-1 ring-red-200" : ""}`}
									/>
									{formErrors.rating && <p className="text-xs text-red-500 mt-1">{formErrors.rating}</p>}
								</div>
							</div>

							<div className="flex gap-3 pt-2">
								<Button
									onClick={handleSubmit}
									disabled={actionLoading !== null}
									className="bg-indigo-500 hover:bg-indigo-600 rounded-xl"
								>
									{actionLoading ? (
										<><LoaderPinwheel className="w-4 h-4 mr-2 animate-spin" />Saving...</>
									) : editingResource ? (
										<>Update Resource</>
									) : (
										<>Create Resource</>
									)}
								</Button>
								<Button variant="outline" onClick={closeForm} className="rounded-xl">
									Cancel
								</Button>
							</div>
						</div>
					)}

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
					) : paginated.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 gap-3">
							<div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
								<BookOpen className="w-8 h-8 text-indigo-400" />
							</div>
							<p className="text-text-secondary text-sm">
								{search || typeFilter || categoryFilter
									? "No resources match your filters"
									: "No resources available yet"}
							</p>
							{!search && !typeFilter && !categoryFilter && (
								<Button onClick={startCreate} variant="outline" className="rounded-xl">
									<Plus className="w-4 h-4 mr-1" />
									Create First Resource
								</Button>
							)}
						</div>
					) : (
						<>
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{paginated.map((r) => {
									const cfg = typeConfig[r.type] || typeConfig.article;
									const TypeIcon = cfg.icon;
									const isEditing = editingResource?.id === r.id;
									const isDeleting = deleteConfirmId === r.id;

									return (
										<div
											key={r.id}
											className={`relative p-4 rounded-2xl border transition-all duration-200 ${
												isEditing
													? "border-indigo-300 bg-indigo-50/50 ring-2 ring-indigo-200"
													: "border-border/40 hover:border-border hover:shadow-md bg-gradient-to-br from-white to-background"
											}`}
										>
											{isEditing && (
												<div className="absolute -top-2 -right-2 px-2 py-1 bg-indigo-500 text-white text-xs rounded-full font-medium">
													Editing
												</div>
											)}

											<div className="flex items-start gap-3">
												<div className={`p-3 rounded-xl ${cfg.bg} shrink-0`}>
													<TypeIcon className={`w-5 h-5 ${cfg.color}`} />
												</div>
												<div className="flex-1 min-w-0">
													<h4 className="text-sm font-semibold truncate">{r.title}</h4>
													<p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
														{r.description || "No description"}
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
												{showPreview === r.id ? (
													<>
														<a
															href={r.url}
															target="_blank"
															rel="noopener noreferrer"
															className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 transition-colors"
														>
															<ExternalLink className="w-3.5 h-3.5" />
															Open Resource
														</a>
														<button
															onClick={() => setShowPreview(null)}
															className="p-1.5 rounded-lg text-text-secondary hover:bg-gray-100"
														>
															<EyeOff className="w-4 h-4" />
														</button>
													</>
												) : (
													<>
														<button
															onClick={() => setShowPreview(r.id)}
															className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-text-secondary text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
														>
															<Eye className="w-3.5 h-3.5" />
															Preview
														</button>
														<a
															href={r.url}
															target="_blank"
															rel="noopener noreferrer"
															className="p-1.5 rounded-lg text-text-secondary hover:bg-gray-100 transition-colors"
														>
															<ExternalLink className="w-4 h-4" />
														</a>
													</>
												)}

												{!isEditing && !isDeleting && (
													<>
														<button
															onClick={() => startEdit(r)}
															className="p-1.5 rounded-lg text-text-secondary hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
														>
															<Edit3 className="w-4 h-4" />
														</button>
														<button
															onClick={() => setDeleteConfirmId(r.id)}
															className="p-1.5 rounded-lg text-text-secondary hover:bg-rose-50 hover:text-rose-500 transition-colors"
														>
															<Trash2 className="w-4 h-4" />
														</button>
													</>
												)}

												{isDeleting && (
													<>
														<button
															onClick={() => handleDelete(r.id)}
															disabled={actionLoading === r.id}
															className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500 text-white text-xs font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
														>
															{actionLoading === r.id ? <LoaderPinwheel className="w-3 h-3 animate-spin" /> : null}
															Confirm
														</button>
														<button
															onClick={() => setDeleteConfirmId(null)}
															className="px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:bg-gray-100"
														>
															Cancel
														</button>
													</>
												)}
											</div>

											{r.created_by_name && (
												<p className="text-xs text-text-secondary/60 mt-2">
													Created by {r.created_by_name}
												</p>
											)}
										</div>
									);
								})}
							</div>

							{totalPages > 1 && (
								<div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
									<p className="text-xs text-text-secondary">
										Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} resources
									</p>
									<div className="flex items-center gap-2">
										<button
											className="p-2 rounded-xl border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
											disabled={page === 1}
											onClick={() => setPage(page - 1)}
										>
											<ChevronLeft className="w-4 h-4" />
										</button>
										<span className="text-sm font-medium px-2">
											{page} / {totalPages}
										</span>
										<button
											className="p-2 rounded-xl border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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