import { chromium } from "@playwright/test";
import path from "path";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = process.env.API_BASE_URL || "http://localhost:8000/api";

const TEST_USERS = {
	student: {
		email: process.env.TEST_STUDENT_EMAIL || "theutpal11@gmail.com",
		password: process.env.TEST_STUDENT_PASSWORD || "password123",
	},
	admin: {
		email: process.env.TEST_ADMIN_EMAIL || "admin@gravix.com",
		password: process.env.TEST_ADMIN_PASSWORD || "password123",
	},
	counsellor: {
		email: process.env.TEST_COUNSELLOR_EMAIL || "priya@gravix.com",
		password: process.env.TEST_COUNSELLOR_PASSWORD || "password123",
	},
};

async function loginViaApiAndSave(
	email: string,
	password: string,
	storageStatePath: string
) {
	const browser = await chromium.launch();
	const context = await browser.newContext({
		baseURL: BASE_URL,
	});
	const page = await context.newPage();

	await page.goto(`${BASE_URL}/`, { timeout: 60000 });
	await page.waitForLoadState("domcontentloaded");

	const response = await page.request.post(`${API_BASE}/login`, {
		data: { email, password },
		headers: { "Content-Type": "application/json" },
	});

	if (!response.ok()) {
		throw new Error(`Login failed for ${email}: ${response.status()} ${response.statusText()}`);
	}

	const tokens = await response.json();

	await page.evaluate(
		({ access, refresh }) => {
			localStorage.setItem("access_token", access);
			localStorage.setItem("refresh_token", refresh);
		},
		{ access: tokens.access, refresh: tokens.refresh }
	);

	await context.storageState({ path: storageStatePath });

	await browser.close();
}

export default async function globalSetup() {
	const baseDir = path.resolve(__dirname);

	await loginViaApiAndSave(
		TEST_USERS.student.email,
		TEST_USERS.student.password,
		path.join(baseDir, ".auth", "student.json")
	);
	await loginViaApiAndSave(
		TEST_USERS.admin.email,
		TEST_USERS.admin.password,
		path.join(baseDir, ".auth", "admin.json")
	);
	await loginViaApiAndSave(
		TEST_USERS.counsellor.email,
		TEST_USERS.counsellor.password,
		path.join(baseDir, ".auth", "counsellor.json")
	);
}
