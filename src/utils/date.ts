export function formatDate(date: Date | string) {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function formatTime(date: Date | string) {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
}
