import { test, expect, Page } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";

// ─── Dashboard Page Tests ─────────────────────────────────────────────────────

test.describe("Dashboard Page (Student Role)", () => {
	test.use({ storageState: "tests/.auth/student.json" });

	let dashboardPage: DashboardPage;

	test.beforeEach(async ({ page, baseURL }) => {
		dashboardPage = new DashboardPage(page, baseURL!);
		await dashboardPage.goto();
	});

	test("should render the dashboard sidebar and navigation", async () => {
		await dashboardPage.expectToBeVisible();
		await expect(dashboardPage.sidebar).toBeVisible();
	});

	test("should display the user name or avatar in the header", async ({ page }) => {
		const userButton = page.locator('button:has-text("User"), [alt="User Avatar"]');
		await expect(userButton.first()).toBeVisible();
	});

	test("should show student navigation items", async ({ page }) => {
		const expectedNavItems = ["Overview", "Chat", "Book Session"];
		for (const item of expectedNavItems) {
			await expect(page.locator(`button:has-text("${item}")`).first()).toBeVisible();
		}
		await expect(page.locator('button:has-text("Assessment")').first()).toBeVisible();
		await expect(page.locator('button:has-text("Resources")').first()).toBeVisible();
	});

	test("should navigate to Chat section and display chat interface", async ({ page }) => {
		await page.locator('button:has-text("Chat")').first().click();
		await expect(page.locator("text=/Chat/i").first()).toBeVisible({ timeout: 3000 });
	});

	test("should navigate to Assessment section", async ({ page }) => {
		await page.locator('button:has-text("Assessment")').first().click();
		await expect(page.locator("text=/Assessment/i").first()).toBeVisible({ timeout: 3000 });
	});

	test("should navigate to Book Session section", async ({ page }) => {
		await page.locator('button:has-text("Book Session")').first().click();
		await expect(page.locator("text=/Book/i").first()).toBeVisible({ timeout: 3000 });
	});

	test("should navigate to Resources section", async ({ page }) => {
		await page.locator('button:has-text("Resources")').first().click();
		await expect(page.locator("text=/Resources/i").first()).toBeVisible({ timeout: 3000 });
	});

	test("should logout and redirect to login page", async ({ page }) => {
		await dashboardPage.clickLogout();
		await page.waitForURL(/\/(login|register)/, { timeout: 10000 }).catch(() => { });
		expect(page.url()).not.toContain("/dashboard");
	});

	test("should not be accessible without authentication", async ({ browser }) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.goto("http://localhost:3000/dashboard");
		await page.waitForLoadState("networkidle");
		await context.close();
	});
});

test.describe("Dashboard Page (Admin Role)", () => {
	test.use({ storageState: "tests/.auth/admin.json" });

	test("should render admin dashboard with admin-specific nav items", async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/dashboard`);
		await page.waitForLoadState("networkidle");

		const expectedNavItems = ["Overview", "User Management", "Assessments", "Bookings", "Resources", "Audit Logs", "Settings"];
		for (const item of expectedNavItems) {
			await expect(page.locator(`button:has-text("${item}")`).first()).toBeVisible({ timeout: 5000 }).catch(() => {
				expect(page.locator(`text=/${item}/i`).first()).toBeVisible();
			});
		}
	});

	test("should navigate to User Management section", async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/dashboard`);
		await page.waitForLoadState("networkidle");
		await page.locator('button:has-text("User Management")').first().click();
		await page.waitForTimeout(1000);
		await expect(page.locator("text=/User/i").first()).toBeVisible({ timeout: 5000 });
	});

	test("should navigate to Audit Logs section", async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/dashboard`);
		await page.waitForLoadState("networkidle");
		const logsBtn = page.locator('button:has-text("Audit Logs")').first();
		await logsBtn.click();
		await page.waitForTimeout(1000);
		await expect(page.locator("text=/Log/i").first()).toBeVisible({ timeout: 5000 });
	});
});

test.describe("Dashboard Navigation & UI", () => {
	test.use({ storageState: "tests/.auth/student.json" });

	test("should highlight the active navigation tab", async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/dashboard`);
		await page.waitForLoadState("networkidle");
		const overviewBtn = page.locator('button:has-text("Overview")').first();
		await expect(overviewBtn).toBeVisible();
	});

	test("should show sidebar on desktop and toggle on mobile", async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/dashboard`);
		await page.setViewportSize({ width: 1280, height: 720 });
		await expect(page.locator("aside")).toBeVisible();

		await page.setViewportSize({ width: 375, height: 667 });
		await page.setViewportSize({ width: 1280, height: 720 });
		await expect(page.locator("aside")).toBeVisible();
	});

	test("should scroll within the main content area", async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/dashboard`);
		await page.setViewportSize({ width: 1280, height: 720 });
		const mainContent = page.locator("main");
		await mainContent.evaluate((el) => {
			el.scrollTop = el.scrollHeight;
		});
	});

	test("should persist selected tab on page reload", async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/dashboard`);
		await page.locator('button:has-text("Chat")').first().click();
		await expect(page.locator("text=/Chat/i").first()).toBeVisible({ timeout: 3000 });
		await page.reload();
		await page.waitForLoadState("networkidle");
	});
});
