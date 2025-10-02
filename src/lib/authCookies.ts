// lib/authCookies.ts
import { cookies } from "next/headers";
import { serialize } from "cookie";

const isProd = process.env.NODE_ENV === "production";

export function setAuthCookies(res: Response, { accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
	const secure = isProd;

	res.headers.append("Set-Cookie", serialize("accessToken", accessToken, {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 15, // 15 min
	}));

	res.headers.append("Set-Cookie", serialize("refreshToken", refreshToken, {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	}));
}

export function clearAuthCookies(res: Response) {
	const secure = isProd;

	res.headers.append("Set-Cookie", serialize("accessToken", "", {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: -1,
	}));

	res.headers.append("Set-Cookie", serialize("refreshToken", "", {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: -1,
	}));
}

export async function getTokensFromCookies() {
	const cookieStore = await cookies();
	return {
		accessToken: cookieStore.get("accessToken")?.value,
		refreshToken: cookieStore.get("refreshToken")?.value,
	};
}
