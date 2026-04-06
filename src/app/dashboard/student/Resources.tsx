"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	BookOpen,
	Play,
	Download,
	Clock,
	Star,
	Search,
	Filter,
	Headphones,
	FileText,
	Video,
	Target,
	Loader2,
	ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";
import { studentService, ResourceResponse } from "@/services/studentService";

const categories = [
	{ id: 'all', label: 'All', icon: BookOpen },
	{ id: 'guides', label: 'Guides', icon: FileText },
	{ id: 'videos', label: 'Videos', icon: Video },
	{ id: 'audio', label: 'Audio', icon: Headphones },
	{ id: 'tools', label: 'Tools', icon: Target }
];

const categoryIconMap: Record<string, any> = {
	'article': FileText,
	'video': Video,
	'document': FileText,
	'link': ExternalLink
};

export default function StudentResources() {
	const [activeCategory, setActiveCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [resources, setResources] = useState<ResourceResponse[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadResources();
	}, [activeCategory]);

	const loadResources = async () => {
		setLoading(true);
		const category = activeCategory === 'all' ? undefined : activeCategory;
		const data = await studentService.getResources(category);
		setResources(data);
		setLoading(false);
	};

	const filteredResources = resources.filter(resource =>
		resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="p-4 sm:p-6 h-full">
			{/* Header */}
			<div className="mb-6 sm:mb-8">
				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Student Resources</h1>
				<p className="text-purple-700 text-sm sm:text-base">Comprehensive wellness guides, videos, and tools to support your journey</p>
			</div>

			{/* Search and Filters */}
			<div className="mb-6 sm:mb-8">
				<Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
					<CardContent className="p-4 sm:p-6">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
								<div className="relative w-full sm:flex-1 sm:max-w-xs text-gray-800">
									<Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" />
									<Input
										placeholder="Search resources..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10 text-sm"
									/>
								</div>
								<Button variant="outline" className="text-text-secondary w-full sm:w-auto text-sm">
									<Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
									Filter
								</Button>
							</div>
						</div>

						{/* Category Tabs */}
						<div className="flex flex-wrap gap-2 mt-4">
							{categories.map((category) => {
								const IconComponent = category.icon;
								return (
									<Button
										key={category.id}
										variant={activeCategory === category.id ? "default" : "outline"}
										size="sm"
										className={`text-xs sm:text-sm ${activeCategory === category.id ? "bg-purple-500 hover:bg-purple-600" : "text-text-secondary"}`}
										onClick={() => setActiveCategory(category.id)}
									>
										<IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
										{category.label}
									</Button>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Resources Grid */}
			{loading ? (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="w-8 h-8 animate-spin text-purple-500" />
				</div>
			) : filteredResources.length === 0 ? (
				<div className="text-center py-12">
					<BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-text-secondary/50 mx-auto mb-4" />
					<h3 className="text-lg sm:text-xl font-semibold text-text-secondary mb-2">No Resources Yet</h3>
					<p className="text-sm sm:text-base text-text-secondary">Resources will appear here once they are added by administrators.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredResources.map((resource) => {
						const IconComponent = categoryIconMap[resource.type] || FileText;
						return (
							<Card key={resource.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all cursor-pointer">
								<CardContent className="p-4">
									<div className="flex items-start justify-between mb-3">
										<div className={`p-2 rounded-lg ${resource.type === 'video' ? 'bg-purple-100' : resource.type === 'audio' ? 'bg-amber-100' : 'bg-green-100'}`}>
											<IconComponent className={`w-5 h-5 ${resource.type === 'video' ? 'text-purple-600' : resource.type === 'audio' ? 'text-amber-600' : 'text-green-600'}`} />
										</div>
										{resource.rating && (
											<div className="flex items-center text-amber-500">
												<Star className="w-4 h-4 mr-1 fill-current" />
												<span className="text-sm font-medium">{resource.rating}</span>
											</div>
										)}
									</div>
									<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
									{resource.description && (
										<p className="text-sm text-text-secondary mb-3 line-clamp-2">{resource.description}</p>
									)}
									<div className="flex items-center justify-between">
										<Badge variant="outline" className="text-xs capitalize">
											{resource.category}
										</Badge>
										{resource.duration && (
											<span className="flex items-center text-xs text-text-secondary">
												<Clock className="w-3 h-3 mr-1" />
												{resource.duration}
											</span>
										)}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}