export const CRISIS_KEYWORDS = [
	"suicide", "kill myself", "ending it", "can't go on", "hopeless", "self-harm"
];

export function containsCrisis(text: string) {
	const t = text.toLowerCase();
	return CRISIS_KEYWORDS.some(k => t.includes(k));
}
