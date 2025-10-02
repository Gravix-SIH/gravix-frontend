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
	Heart,
	Brain,
	Moon,
	Target,
	Headphones,
	FileText,
	Video,

	TrendingUp,
	Users,
	Award,
	Eye,
	Bookmark,
	Share2
} from "lucide-react";
import { useState } from "react";

export default function StudentResources() {
	const [activeCategory, setActiveCategory] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [viewMode, setViewMode] = useState('grid');

	const categories = [
		{ id: 'all', label: 'All Resources', icon: BookOpen },
		{ id: 'guides', label: 'Guides', icon: FileText },
		{ id: 'videos', label: 'Videos', icon: Video },
		{ id: 'audio', label: 'Audio', icon: Headphones },
		{ id: 'tools', label: 'Tools', icon: Target }
	];

	const resources = [
		// Guides
		{
			id: 1,
			title: "Complete Guide to Effective Study Habits",
			description: "Scientifically-backed strategies to improve focus, retention, and academic performance.",
			type: "guide",
			category: "Academic",
			duration: "15 min read",
			rating: 4.8,
			views: 1250,
			downloads: 340,
			difficulty: "Beginner",
			tags: ["Study Skills", "Productivity", "Focus"],
			thumbnail: "📚",
			author: "Dr. Sarah Chen",
			lastUpdated: "2 days ago",
			featured: true
		},
		{
			id: 2,
			title: "Mindfulness Basics for Students",
			description: "Learn foundational mindfulness techniques to reduce stress and improve well-being.",
			type: "guide",
			category: "Mental Health",
			duration: "12 min read",
			rating: 4.9,
			views: 980,
			downloads: 215,
			difficulty: "Beginner",
			tags: ["Mindfulness", "Stress Relief", "Meditation"],
			thumbnail: "🧘",
			author: "Prof. Michael Torres",
			lastUpdated: "1 week ago",
			featured: false
		},
		{
			id: 3,
			title: "Time Management Strategies That Actually Work",
			description: "Practical time management techniques tailored specifically for busy students.",
			type: "guide",
			category: "Productivity",
			duration: "18 min read",
			rating: 4.7,
			views: 1580,
			downloads: 420,
			difficulty: "Intermediate",
			tags: ["Time Management", "Planning", "Organization"],
			thumbnail: "⏰",
			author: "Dr. Lisa Park",
			lastUpdated: "3 days ago",
			featured: true
		},

		// Videos
		{
			id: 4,
			title: "10-Minute Guided Meditation for Focus",
			description: "A calming guided meditation session designed to enhance concentration and mental clarity.",
			type: "video",
			category: "Mental Health",
			duration: "10 mins",
			rating: 4.9,
			views: 2340,
			downloads: 0,
			difficulty: "Beginner",
			tags: ["Meditation", "Focus", "Relaxation"],
			thumbnail: "🎬",
			author: "Meditation Center",
			lastUpdated: "5 days ago",
			featured: true
		},
		{
			id: 5,
			title: "Yoga for Stress Relief - Full Session",
			description: "Complete yoga routine specifically designed to help students release tension and stress.",
			type: "video",
			category: "Physical Health",
			duration: "25 mins",
			rating: 4.8,
			views: 1890,
			downloads: 0,
			difficulty: "Beginner",
			tags: ["Yoga", "Stress Relief", "Physical Health"],
			thumbnail: "🧘‍♀️",
			author: "Wellness Studio",
			lastUpdated: "1 week ago",
			featured: false
		},
		{
			id: 6,
			title: "Breathing Exercises for Anxiety",
			description: "Learn effective breathing techniques to manage anxiety and panic attacks.",
			type: "video",
			category: "Mental Health",
			duration: "8 mins",
			rating: 4.7,
			views: 1456,
			downloads: 0,
			difficulty: "Beginner",
			tags: ["Breathing", "Anxiety", "Coping Skills"],
			thumbnail: "💨",
			author: "Dr. Anxiety Clinic",
			lastUpdated: "4 days ago",
			featured: false
		},

		// Audio
		{
			id: 7,
			title: "Sleep Stories for Better Rest",
			description: "Calming bedtime stories designed to help you fall asleep faster and sleep deeper.",
			type: "audio",
			category: "Sleep Health",
			duration: "30 mins",
			rating: 4.6,
			views: 890,
			downloads: 156,
			difficulty: "Beginner",
			tags: ["Sleep", "Relaxation", "Bedtime"],
			thumbnail: "🎧",
			author: "Sleep Wellness",
			lastUpdated: "6 days ago",
			featured: false
		},

		// Tools
		{
			id: 8,
			title: "Mood Tracking Journal Template",
			description: "Downloadable template to track daily moods, triggers, and patterns for better self-awareness.",
			type: "tool",
			category: "Mental Health",
			duration: "Self-paced",
			rating: 4.5,
			views: 567,
			downloads: 189,
			difficulty: "Beginner",
			tags: ["Mood Tracking", "Self-Reflection", "Journal"],
			thumbnail: "📊",
			author: "Mental Health Tools",
			lastUpdated: "1 week ago",
			featured: false
		}
	];

	const filteredResources = resources.filter(resource => {
		const matchesCategory = activeCategory === 'all' ||
			(activeCategory === 'guides' && resource.type === 'guide') ||
			(activeCategory === 'videos' && resource.type === 'video') ||
			(activeCategory === 'audio' && resource.type === 'audio') ||
			(activeCategory === 'tools' && resource.type === 'tool');

		const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

		return matchesCategory && matchesSearch;
	});

	const featuredResources = resources.filter(r => r.featured);

	const getTypeIcon = (type) => {
		switch (type) {
			case 'guide': return FileText;
			case 'video': return Video;
			case 'audio': return Headphones;
			case 'tool': return Target;
			default: return BookOpen;
		}
	};

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case 'Beginner': return 'bg-green-50 text-green-700 border-green-200';
			case 'Intermediate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
			case 'Advanced': return 'bg-red-50 text-red-700 border-red-200';
			default: return 'bg-gray-50 text-gray-700 border-gray-200';
		}
	};

	return (
		<div className="p-6 h-full max-h-[91vh] overflow-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white mb-2">Student Resources</h1>
				<p className="text-purple-100">Comprehensive wellness guides, videos, and tools to support your journey</p>
			</div>

			{/* Search and Filters */}
			<div className="mb-8">
				<Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
							<div className="flex items-center space-x-4 flex-1">
								<div className="relative flex-1 max-w-md text-gray-800">
									<Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700" />
									<Input
										placeholder="Search resources, topics, or keywords..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
								<Button variant="outline" className="text-gray-600">
									<Filter className="w-4 h-4 mr-2" />
									Filter
								</Button>
							</div>

							<div className="flex items-center space-x-2">
								<span className="text-sm text-gray-600">Found {filteredResources.length} resources</span>
							</div>
						</div>

						{/* Category Tabs */}
						<div className="flex flex-wrap gap-2 mt-6">
							{categories.map((category) => {
								const IconComponent = category.icon;
								return (
									<Button
										key={category.id}
										variant={activeCategory === category.id ? "default" : "outline"}
										size="sm"
										className={activeCategory === category.id ? "bg-purple-500 hover:bg-purple-600" : "text-gray-600"}
										onClick={() => setActiveCategory(category.id)}
									>
										<IconComponent className="w-4 h-4 mr-2" />
										{category.label}
									</Button>
								);
							})}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Featured Resources */}
			{activeCategory === 'all' && featuredResources.length > 0 && (
				<div className="mb-8">
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-xl text-gray-800 flex items-center">
								<Award className="w-6 h-6 mr-2 text-yellow-500" />
								Featured Resources
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
								{featuredResources.map((resource) => {
									const TypeIcon = getTypeIcon(resource.type);
									return (
										<Card key={resource.id} className="border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-all cursor-pointer">
											<CardContent className="p-4">
												<div className="flex items-start space-x-3">
													<div className="text-3xl">{resource.thumbnail}</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-start justify-between mb-2">
															<h4 className="font-semibold text-gray-900 line-clamp-2 text-sm">{resource.title}</h4>
															<Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>
														</div>
														<div className="flex items-center space-x-4 text-xs text-gray-500">
															<div className="flex items-center">
																<TypeIcon className="w-3 h-3 mr-1" />
																{resource.type}
															</div>
															<div className="flex items-center">
																<Clock className="w-3 h-3 mr-1" />
																{resource.duration}
															</div>
															<div className="flex items-center">
																<Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
																{resource.rating}
															</div>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Main Resources Grid */}
			<div className="grid gap-6 lg:grid-cols-12">
				<div className="lg:col-span-12">
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardContent className="p-6">
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{filteredResources.map((resource) => {
									const TypeIcon = getTypeIcon(resource.type);
									return (
										<Card key={resource.id} className="border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
											<CardContent className="p-5">
												<div className="flex items-start justify-between mb-3">
													<div className="text-4xl">{resource.thumbnail}</div>
													<div className="flex items-center space-x-1">
														<Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 p-1">
															<Bookmark className="w-4 h-4" />
														</Button>
														<Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 p-1">
															<Share2 className="w-4 h-4" />
														</Button>
													</div>
												</div>

												<div className="space-y-3">
													<div>
														<h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{resource.title}</h3>
														<p className="text-sm text-gray-600 line-clamp-2 mb-2">{resource.description}</p>
													</div>

													<div className="flex flex-wrap gap-1">
														{resource.tags.slice(0, 2).map((tag, index) => (
															<Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
																{tag}
															</Badge>
														))}
													</div>

													<div className="flex items-center justify-between text-xs text-gray-500">
														<div className="flex items-center space-x-3">
															<div className="flex items-center">
																<TypeIcon className="w-3 h-3 mr-1" />
																{resource.type}
															</div>
															<div className="flex items-center">
																<Clock className="w-3 h-3 mr-1" />
																{resource.duration}
															</div>
														</div>
														<Badge variant="outline" className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
															{resource.difficulty}
														</Badge>
													</div>

													<div className="flex items-center justify-between">
														<div className="flex items-center space-x-4 text-xs text-gray-500">
															<div className="flex items-center">
																<Star className="w-3 h-3 mr-1 text-yellow-500 fill-current" />
																{resource.rating}
															</div>
															<div className="flex items-center">
																<Eye className="w-3 h-3 mr-1" />
																{resource.views}
															</div>
															{resource.downloads > 0 && (
																<div className="flex items-center">
																	<Download className="w-3 h-3 mr-1" />
																	{resource.downloads}
																</div>
															)}
														</div>
													</div>

													<div className="pt-2 border-t">
														<div className="flex items-center justify-between">
															<span className="text-xs text-gray-500">By {resource.author}</span>
															<Button size="sm" className="bg-purple-500 hover:bg-purple-600">
																{resource.type === 'video' ? (
																	<><Play className="w-3 h-3 mr-1" /> Watch</>
																) : resource.type === 'audio' ? (
																	<><Play className="w-3 h-3 mr-1" /> Listen</>
																) : (
																	<><BookOpen className="w-3 h-3 mr-1" /> Read</>
																)}
															</Button>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}