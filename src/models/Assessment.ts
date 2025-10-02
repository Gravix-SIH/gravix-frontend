export interface Assessment {
	id: string;
	userId: string;
	type: string;       // e.g., "stress_test", "anxiety_scale"
	answers: Record<string, string>;
	score: number;
	result: string;     // e.g., "low", "moderate", "high"
	createdAt: Date;
}
