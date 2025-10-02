export type ResourceType = "article" | "video" | "document" | "link";

export interface Resource {
	id: string;
	title: string;
	type: ResourceType;
	url: string;
	description?: string;
	createdAt: Date;
}
