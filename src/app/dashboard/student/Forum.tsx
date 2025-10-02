"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
	MessageCircle,
	ThumbsUp,
	Search,
	Filter,
	Plus,
	Pin,
	TrendingUp,
	Clock,
	Users,
	Heart,
	Brain,
	Moon,
	BookOpen,
	Star,
	Eye,
	ChevronUp,
	ChevronDown,
	MoreHorizontal,
	Flag,
	Share2,
	Send
} from "lucide-react";
import { useState } from "react";

export default function StudentForum() {
	const [activeCategory, setActiveCategory] = useState('all');
	const [newPost, setNewPost] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('recent');

	const categories = [
		{ id: 'all', label: 'All Topics', icon: MessageCircle, count: 156 },
		{ id: 'stress', label: 'Stress Management', icon: Brain, count: 45 },
		{ id: 'sleep', label: 'Sleep Health', icon: Moon, count: 32 },
		{ id: 'wellness', label: 'General Wellness', icon: Heart, count: 38 },
		{ id: 'academic', label: 'Academic Support', icon: BookOpen, count: 41 }
	];

	const discussions = [
		{
			id: 1,
			title: "Coping with exam stress - Need urgent advice!",
			author: "stressed_student23",
			avatar: "👤",
			category: "stress",
			replies: 14,
			likes: 23,
			views: 156,
			lastActivity: "2 hours ago",
			lastReplyBy: "dr_wellness",
			isPinned: false,
			isHot: true,
			tags: ["exams", "anxiety", "coping"],
			preview: "I have my finals coming up next week and I'm feeling overwhelmed...",
			solved: false
		},
		{
			id: 2,
			title: "How to maintain work-life balance as a student?",
			author: "balanced_learner",
			avatar: "👨‍🎓",
			category: "wellness",
			replies: 7,
			likes: 18,
			views: 89,
			lastActivity: "5 hours ago",
			lastReplyBy: "study_guru",
			isPinned: true,
			isHot: false,
			tags: ["balance", "productivity", "lifestyle"],
			preview: "Working part-time while studying is getting really challenging...",
			solved: true
		},
		{
			id: 3,
			title: "Best relaxation apps? Looking for recommendations",
			author: "mindful_maya",
			avatar: "👩",
			category: "wellness",
			replies: 5,
			likes: 12,
			views: 67,
			lastActivity: "1 day ago",
			lastReplyBy: "app_reviewer",
			isPinned: false,
			isHot: false,
			tags: ["apps", "relaxation", "meditation"],
			preview: "Can anyone recommend good apps for meditation and relaxation?",
			solved: false
		},
		{
			id: 4,
			title: "Sleep schedule completely messed up - help!",
			author: "night_owl_student",
			avatar: "🦉",
			category: "sleep",
			replies: 11,
			likes: 19,
			views: 134,
			lastActivity: "3 hours ago",
			lastReplyBy: "sleep_expert",
			isPinned: false,
			isHot: true,
			tags: ["sleep", "schedule", "insomnia"],
			preview: "My sleep schedule is completely reversed and it's affecting my studies...",
			solved: false
		},
		{
			id: 5,
			title: "Study group formation for peer support",
			author: "group_organizer",
			avatar: "👥",
			category: "academic",
			replies: 22,
			likes: 31,
			views: 198,
			lastActivity: "1 hour ago",
			lastReplyBy: "supportive_peer",
			isPinned: false,
			isHot: true,
			tags: ["study-group", "collaboration", "support"],
			preview: "Looking to form a study group focused on mental wellness...",
			solved: false
		}
	];

	const popularTags = [
		"stress-management", "study-tips", "anxiety", "sleep-health",
		"meditation", "work-life-balance", "exam-prep", "wellness"
	];

	const filteredDiscussions = discussions.filter(discussion => {
		const matchesCategory = activeCategory === 'all' || discussion.category === activeCategory;
		const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			discussion.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
			discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
		return matchesCategory && matchesSearch;
	});

	const getCategoryIcon = (categoryId) => {
		const category = categories.find(cat => cat.id === categoryId);
		return category ? category.icon : MessageCircle;
	};

	const handlePostSubmit = () => {
		if (newPost.trim()) {
			// Handle post submission
			setNewPost('');
		}
	};

	return (
		<div className="p-6 h-full max-h-[91vh] overflow-auto">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-white mb-2">Community Forum</h1>
				<p className="text-purple-100">Connect, share experiences, and support each other on your wellness journey</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				{/* Main Content */}
				<div className="lg:col-span-8 space-y-6">
					{/* Create New Post */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-lg text-gray-800 flex items-center">
								<Plus className="w-5 h-5 mr-2 text-purple-600" />
								Start a New Discussion
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
										You
									</div>
									<div className="flex-1">
										<Input
											placeholder="What's on your mind? Share your thoughts or ask for support..."
											value={newPost}
											onChange={(e) => setNewPost(e.target.value)}
											className="border-gray-200 focus:border-purple-400"
										/>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<div className="flex flex-wrap gap-2">
										{popularTags.slice(0, 4).map((tag) => (
											<Badge key={tag} variant="outline" className="cursor-pointer hover:bg-purple-50 text-xs">
												#{tag}
											</Badge>
										))}
									</div>
									<Button
										onClick={handlePostSubmit}
										disabled={!newPost.trim()}
										className="bg-purple-500 hover:bg-purple-600"
									>
										<Send className="w-4 h-4 mr-2" />
										Post
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Search and Filters */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardContent className="p-4">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
								<div className="flex items-center space-x-4 flex-1">
									<div className="relative flex-1 max-w-md">
										<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
										<Input
											placeholder="Search discussions..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="pl-10"
										/>
									</div>
									<Button variant="outline" size="sm">
										<Filter className="w-4 h-4 mr-1" />
										Filter
									</Button>
								</div>

								<div className="flex items-center space-x-3">
									<select
										value={sortBy}
										onChange={(e) => setSortBy(e.target.value)}
										className="text-sm border rounded-md px-3 py-1"
									>
										<option value="recent">Most Recent</option>
										<option value="popular">Most Popular</option>
										<option value="replies">Most Replies</option>
									</select>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Discussions List */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="text-xl text-gray-800 flex items-center">
									<MessageCircle className="w-6 h-6 mr-2 text-purple-600" />
									Recent Discussions
								</CardTitle>
								<Badge variant="outline" className="bg-purple-50 text-purple-700">
									{filteredDiscussions.length} discussions
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{filteredDiscussions.map((discussion) => {
									const CategoryIcon = getCategoryIcon(discussion.category);
									return (
										<div key={discussion.id}
											className={`p-5 rounded-xl border transition-all hover:shadow-md cursor-pointer ${discussion.isPinned ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' :
													'bg-white hover:border-purple-200 border-gray-100'
												}`}>

											{/* Header */}
											<div className="flex items-start justify-between mb-3">
												<div className="flex items-start space-x-3 flex-1">
													<div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-lg">
														{discussion.avatar}
													</div>

													<div className="flex-1 min-w-0">
														<div className="flex items-center space-x-2 mb-1">
															{discussion.isPinned && <Pin className="w-4 h-4 text-yellow-600" />}
															{discussion.isHot && <TrendingUp className="w-4 h-4 text-red-500" />}
															{discussion.solved && <Badge className="bg-green-50 text-green-700 text-xs">Solved</Badge>}
															<h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
																{discussion.title}
															</h3>
														</div>

														<p className="text-sm text-gray-600 mb-2 line-clamp-1">{discussion.preview}</p>

														<div className="flex items-center space-x-4 text-xs text-gray-500">
															<span className="flex items-center">
																<CategoryIcon className="w-3 h-3 mr-1" />
																by {discussion.author}
															</span>
															<span className="flex items-center">
																<Clock className="w-3 h-3 mr-1" />
																{discussion.lastActivity}
															</span>
															<span>Last reply by {discussion.lastReplyBy}</span>
														</div>
													</div>
												</div>

												<Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
													<MoreHorizontal className="w-4 h-4" />
												</Button>
											</div>

											{/* Tags */}
											<div className="flex flex-wrap gap-1 mb-3">
												{discussion.tags.map((tag, index) => (
													<Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 cursor-pointer">
														#{tag}
													</Badge>
												))}
											</div>

											{/* Stats and Actions */}
											<div className="flex items-center justify-between">
												<div className="flex items-center space-x-4">
													<div className="flex items-center text-sm text-gray-600">
														<MessageCircle className="w-4 h-4 mr-1" />
														{discussion.replies} replies
													</div>
													<div className="flex items-center text-sm text-gray-600">
														<ThumbsUp className="w-4 h-4 mr-1" />
														{discussion.likes} likes
													</div>
													<div className="flex items-center text-sm text-gray-600">
														<Eye className="w-4 h-4 mr-1" />
														{discussion.views} views
													</div>
												</div>

												<div className="flex items-center space-x-2">
													<Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
														<ThumbsUp className="w-4 h-4" />
													</Button>
													<Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
														<Share2 className="w-4 h-4" />
													</Button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sidebar */}
				<div className="lg:col-span-4 space-y-6">
					{/* Categories */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-lg text-gray-800">Categories</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{categories.map((category) => {
									const IconComponent = category.icon;
									return (
										<div key={category.id}
											className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${activeCategory === category.id
													? 'bg-purple-100 text-purple-700'
													: 'hover:bg-gray-50 text-gray-700'
												}`}
											onClick={() => setActiveCategory(category.id)}>
											<div className="flex items-center space-x-3">
												<IconComponent className="w-4 h-4" />
												<span className="font-medium">{category.label}</span>
											</div>
											<Badge variant="outline" className="text-xs">
												{category.count}
											</Badge>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>

					{/* Popular Tags */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-lg text-gray-800">Popular Tags</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{popularTags.map((tag) => (
									<Badge key={tag} variant="outline" className="cursor-pointer hover:bg-purple-50 text-xs">
										#{tag}
									</Badge>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Community Stats */}
					<Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
						<CardHeader>
							<CardTitle className="text-lg text-white">Community Stats</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<Users className="w-5 h-5 mr-2" />
									<span>Active Members</span>
								</div>
								<span className="font-bold text-xl">2,341</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<MessageCircle className="w-5 h-5 mr-2" />
									<span>Total Discussions</span>
								</div>
								<span className="font-bold text-xl">856</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center">
									<Heart className="w-5 h-5 mr-2" />
									<span>Support Given</span>
								</div>
								<span className="font-bold text-xl">4,129</span>
							</div>
						</CardContent>
					</Card>

					{/* Forum Guidelines */}
					<Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="text-lg text-gray-800">Forum Guidelines</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-gray-600 space-y-2">
							<div className="flex items-start space-x-2">
								<Heart className="w-4 h-4 mt-0.5 text-red-400" />
								<span>Be kind and supportive to fellow students</span>
							</div>
							<div className="flex items-start space-x-2">
								<Flag className="w-4 h-4 mt-0.5 text-blue-400" />
								<span>Report inappropriate content</span>
							</div>
							<div className="flex items-start space-x-2">
								<Star className="w-4 h-4 mt-0.5 text-yellow-400" />
								<span>Share your experiences and tips</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}