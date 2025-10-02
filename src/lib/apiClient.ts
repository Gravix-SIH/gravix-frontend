// lib/apiClient.ts
export async function apiClient(path: string, opts: RequestInit = {}) {
	const res = await fetch(`/api/proxy/${path}`, {
		credentials: "include",
		...opts,
		headers: {
			"Content-Type": "application/json",
			...(opts.headers || {}),
		},
	});

	if (!res.ok) {
		throw new Error(await res.text());
	}
	return res.json();
}
