export interface ForumPost {
	id: string;
	authorId: string;       // Can be anon or real
	title: string;
	content: string;
	tags?: string[];
	createdAt: Date;
	updatedAt?: Date;
	upvotes: number;
}

export interface ForumComment {
	id: string;
	postId: string;
	authorId: string;       // Can be anon or real
	content: string;
	createdAt: Date;
	upvotes: number;
}
