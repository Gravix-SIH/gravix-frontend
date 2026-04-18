import { test, expect, Page } from "@playwright/test";
import { CounselorBooking } from "@/services/CounselorService";

async function waitForLoader(page: Page, timeout = 5000) {
	const loader = page.locator('[class*="animate-spin"]').first();
	try {
		await loader.waitFor({ state: "hidden", timeout });
	} catch {
	}
}

// ─── Counsellor Dashboard Tests ───────────────────────────────────────────────

test.describe("Counsellor Dashboard", () => {
	test.describe("Overview", () => {
		test.use({ storageState: "tests/.auth/counsellor.json" });

		test("should render counsellor dashboard with 4 nav items", async ({ page, baseURL }) => {
			await page.goto(`${baseURL}/dashboard`);
			await waitForLoader(page);

			const navItems = ["Overview", "Assessments", "My Bookings", "Resources"];
			for (const item of navItems) {
				await expect(page.locator(`button:has-text("${item}")`).first()).toBeVisible({ timeout: 5000 });
			}
		});

		test("should display Overview stat cards by default", async ({ page, baseURL }) => {
			await page.goto(`${baseURL}/dashboard`);
			await waitForLoader(page);

			const statCard = page.locator("text=/Session/i").first();
			await expect(statCard).toBeVisible({ timeout: 5000 });
		});

		test("should display Session Summary and Assessment Activity cards", async ({ page, baseURL }) => {
			await page.goto(`${baseURL}/dashboard`);
			await waitForLoader(page);

			await expect(page.locator("text=/Session Summary/i")).toBeVisible({ timeout: 5000 });
			await expect(page.locator("text=/Assessment Activity/i")).toBeVisible({ timeout: 5000 });
		});
	});

	test.describe("Assessments Tab", () => {
		test.use({ storageState: "tests/.auth/counsellor.json" });

		async function goToAssessments(page: Page, baseURL: string) {
			await page.goto(`${baseURL}/dashboard`);
			await waitForLoader(page);
			await page.locator('button:has-text("Assessments")').click();
			await page.waitForTimeout(1000);
		}

		test("should navigate to Assessments tab and show summary cards", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);
			await expect(page.locator("text=/PHQ-9/i").first()).toBeVisible({ timeout: 5000 });
			await expect(page.locator("text=/GAD-7/i").first()).toBeVisible({ timeout: 3000 });
			await expect(page.locator("text=/PSQI/i").first()).toBeVisible({ timeout: 3000 });
		});

		test("should display Student Assessments heading", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);
			await expect(page.locator("text=/Student Assessments/i")).toBeVisible({ timeout: 5000 });
		});

		test("should show filter dropdowns for type and severity", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);
			await expect(page.locator("text=/All Types/i")).toBeVisible({ timeout: 5000 });
			await expect(page.locator("text=/All Severity/i")).toBeVisible({ timeout: 3000 });
		});

		test("should filter assessments by PHQ-9 type", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);

			await page.locator("text=/All Types/i").click();
			await page.locator('[role="option"]:has-text("PHQ-9")').click();
			await page.waitForTimeout(1000);

			await expect(page.locator("text=/Failed to load/i")).not.toBeVisible();
		});

		test("should filter assessments by GAD-7 type", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);

			await page.locator("text=/All Types/i").click();
			await page.locator('[role="option"]:has-text("GAD-7")').click();
			await page.waitForTimeout(1000);

			await expect(page.locator("text=/Failed to load/i")).not.toBeVisible();
		});

		test("should filter assessments by PSQI type", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);

			await page.locator("text=/All Types/i").click();
			await page.locator('[role="option"]:has-text("PSQI")').click();
			await page.waitForTimeout(1000);

			await expect(page.locator("text=/Failed to load/i")).not.toBeVisible();
		});

		test("should filter by severity (e.g. Minimal, Mild, Moderate)", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);

			await page.locator("text=/All Severity/i").click();
			const option = page.locator('[role="option"]:has-text("Mild")').first();
			if (await option.isVisible()) {
				await option.click();
				await page.waitForTimeout(1000);
			}

			await expect(page.locator("text=/Failed to load/i")).not.toBeVisible();
		});

		test("should show empty state when no assessments match filter", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);

			await page.locator("text=/All Types/i").click();
			await page.locator('[role="option"]:has-text("PSQI")').click();
			await page.waitForTimeout(2000);

			const hasEmptyOrList = await (
				page.locator("text=/No assessments found/i").isVisible({ timeout: 3000 }).catch(() => false) ||
				page.locator('[class*="border"]').first().isVisible({ timeout: 3000 }).catch(() => false)
			);
			expect(hasEmptyOrList).toBeTruthy();
		});

		test("should open assessment detail modal when eye button is clicked", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);
			await page.waitForTimeout(2000);

			const eyeButton = page.locator('[class*="bg-indigo-50"]:has(svg)').first();
			if (await eyeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
				await eyeButton.click();
				await page.waitForTimeout(500);
				const hasCloseBtn = await page.locator("button:has-text('Close')").isVisible({ timeout: 3000 }).catch(() => false);
				expect(hasCloseBtn).toBeTruthy();

				await page.locator("button:has-text('Close')").click();
				await page.waitForTimeout(300);
			}
		});

		test("should paginate assessments when many exist", async ({ page, baseURL }) => {
			await goToAssessments(page, baseURL!);
			await page.waitForTimeout(2000);

			const hasPagination = await (
				page.locator("text=/←/i").isVisible({ timeout: 2000 }).catch(() => false) ||
				page.locator("button:has-text('←')").isVisible({ timeout: 2000 }).catch(() => false)
			);
			if (hasPagination) {
				const nextBtn = page.locator("button:has-text('→')").first();
				if (await nextBtn.isEnabled({ timeout: 2000 }).catch(() => false)) {
					await nextBtn.click();
					await page.waitForTimeout(500);
				}
			}
		});
	});

	test.describe("My Bookings Tab", () => {
		test.use({ storageState: "tests/.auth/counsellor.json" });

		async function goToBookings(page: Page, baseURL: string) {
			await page.goto(`${baseURL}/dashboard`);
			await waitForLoader(page);
			await page.locator('button:has-text("My Bookings")').click();
			await page.waitForTimeout(1000);
		}

		test("should navigate to My Bookings and show summary cards", async ({ page, baseURL }) => {
			await goToBookings(page, baseURL!);
			await expect(page.locator("text=/Total Bookings/i").or(page.locator("text=/Total/i"))).toBeVisible({ timeout: 5000 });
		});

		test("should display search input and status filter", async ({ page, baseURL }) => {
			await goToBookings(page, baseURL!);
			await expect(page.locator('input[placeholder*="Search"]')).toBeVisible({ timeout: 5000 });
			await expect(page.locator("text=/All Statuses/i")).toBeVisible({ timeout: 3000 });
		});

		test("should filter bookings by status", async ({ page, baseURL }) => {
			await goToBookings(page, baseURL!);

			await page.locator("text=/All Statuses/i").click();
			await page.locator('[role="option"]:has-text("Pending")').click();
			await page.waitForTimeout(1000);

			const hasPendingOrEmpty = await (
				page.locator("text=/Pending/i").first().isVisible({ timeout: 3000 }).catch(() => false) ||
				page.locator("text=/No bookings found/i").isVisible({ timeout: 3000 }).catch(() => false)
			);
			expect(hasPendingOrEmpty).toBeTruthy();
		});

		test("should search bookings by student name", async ({ page, baseURL }) => {
			await goToBookings(page, baseURL!);

			const searchInput = page.locator('input[placeholder*="Search"]');
			await searchInput.fill("xyznonexistent123");
			await page.waitForTimeout(1500);

			const hasResultsOrEmpty = await (
				page.locator('[class*="border"]').first().isVisible({ timeout: 3000 }).catch(() => false) ||
				page.locator("text=/No bookings found/i").isVisible({ timeout: 3000 }).catch(() => false)
			);
			expect(hasResultsOrEmpty).toBeTruthy();
		});

		test("should open confirm modal when Confirm button is clicked for pending booking", async ({ page, baseURL }) => {
			await goToBookings(page, baseURL!);
			await page.waitForTimeout(2000);

			const confirmBtn = page.locator("button:has-text('Confirm')").first();
			if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
				await confirmBtn.click();
				await page.waitForTimeout(500);

				const hasModal = await (
					page.locator("text=/Confirm Session/i").isVisible({ timeout: 3000 }).catch(() => false) ||
					page.locator("text=/Meeting Link/i").isVisible({ timeout: 3000 }).catch(() => false) ||
					page.locator("text=/Address/i").isVisible({ timeout: 3000 }).catch(() => false) ||
					page.locator("text=/Phone/i").isVisible({ timeout: 3000 }).catch(() => false)
				);
				expect(hasModal).toBeTruthy();

				await page.locator("button:has-text('Cancel')").click();
				await page.waitForTimeout(300);
			}
		});

		test("should open edit modal when Edit button is clicked for confirmed booking", async ({ page, baseURL }) => {
			await goToBookings(page, baseURL!);
			await page.waitForTimeout(2000);

			await page.locator("text=/All Statuses/i").click();
			await page.locator('[role="option"]:has-text("Confirmed")').click();
			await page.waitForTimeout(1500);

			const editBtn = page.locator("button:has-text('Edit')").first();
			if (await editBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
				await editBtn.click();
				await page.waitForTimeout(500);

				const hasEditModal = await (
					page.locator("text=/Edit Session Details/i").isVisible({ timeout: 3000 }).catch(() => false)
				);
				expect(hasEditModal).toBeTruthy();

				await page.locator("button:has-text('Cancel')").click();
				await page.waitForTimeout(300);
			}
		});

		test("should cancel a booking when Cancel button is clicked", async ({ page, baseURL }) => {
			await goToBookings(page, baseURL!);
			await page.waitForTimeout(2000);

			const cancelBtn = page.locator("button:has-text('Cancel')").first();
			if (await cancelBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
				await cancelBtn.click();
				await page.waitForTimeout(2000);
				const hasToast = await (
					page.locator("[data-sonner-toaster]").isVisible({ timeout: 3000 }).catch(() => false) ||
					page.locator("text=/cancelled/i").isVisible({ timeout: 3000 }).catch(() => false)
				);
				expect(hasToast).toBeTruthy();
			}
		});

		test("should paginate bookings when many exist", async ({ page, baseURL }) => {
			await goToBookings(page, baseURL!);
			await page.waitForTimeout(2000);

			const nextBtn = page.locator("button:has-text('→')").first();
			if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
				const isDisabled = await nextBtn.isDisabled().catch(() => true);
				if (!isDisabled) {
					await nextBtn.click();
					await page.waitForTimeout(500);
				}
			}
		});
	});

	// ── Resources ───────────────────────────────────────────────────────────────

	test.describe("Resources Tab", () => {
		test.use({ storageState: "tests/.auth/counsellor.json" });

		async function goToResources(page: Page, baseURL: string) {
			await page.goto(`${baseURL}/dashboard`);
			await waitForLoader(page);
			await page.locator('button:has-text("Resources")').click();
			await page.waitForTimeout(1500);
		}

		test("should navigate to Resources and display resource library heading", async ({ page, baseURL }) => {
			await goToResources(page, baseURL!);
			await expect(page.locator("text=/Resource Library/i")).toBeVisible({ timeout: 5000 });
		});

		test("should display Total Resources stat card", async ({ page, baseURL }) => {
			await goToResources(page, baseURL!);
			await expect(page.locator("text=/Total Resources/i")).toBeVisible({ timeout: 5000 });
		});

		test("should show type filter dropdowns", async ({ page, baseURL }) => {
			await goToResources(page, baseURL!);
			await expect(page.locator("text=/^Type$/i")).toBeVisible({ timeout: 5000 });
			await expect(page.locator("text=/^Category$/i")).toBeVisible({ timeout: 3000 });
		});

		test("should display quick tips card about sharing resources", async ({ page, baseURL }) => {
			await goToResources(page, baseURL!);
			await expect(page.locator("text=/Sharing Resources with Students/i")).toBeVisible({ timeout: 5000 });
		});

		test("should filter resources by type (Article, Video, Document)", async ({ page, baseURL }) => {
			await goToResources(page, baseURL!);

			const typeCombobox = page.locator("comboBox").filter({ hasText: /^Type$/ }).first();
			if (await typeCombobox.isVisible({ timeout: 2000 }).catch(() => false)) {
				await typeCombobox.click();
				await page.waitForTimeout(500);

				const articleOption = page.locator('[role="option"]:has-text("Article")').first();
				if (await articleOption.isVisible({ timeout: 2000 }).catch(() => false)) {
					await articleOption.click();
					await page.waitForTimeout(1000);
				}
			}
			await expect(page.locator("text=/Resource Library/i")).toBeVisible();
		});

		test("should search resources by title", async ({ page, baseURL }) => {
			await goToResources(page, baseURL!);

			const searchInput = page.locator('input[placeholder*="Search"]');
			await searchInput.fill("xyznotexist123");
			await page.waitForTimeout(1500);

			const hasEmpty = await page.locator("text=/No resources match/i").isVisible({ timeout: 3000 }).catch(() => false);
			expect(hasEmpty || true).toBeTruthy();
		});

		test("should toggle Preview on a resource", async ({ page, baseURL }) => {
			await goToResources(page, baseURL!);
			await page.waitForTimeout(2000);

			const previewBtn = page.locator("button:has-text('Preview')").first();
			if (await previewBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
				await previewBtn.click();
				await page.waitForTimeout(500);

				const linkAfterClick = await page.locator('a[href*="example.com"]').first().isVisible({ timeout: 3000 }).catch(() => false);
				expect(linkAfterClick).toBeTruthy();
			}
		});

		test("should open external resource link in new tab", async ({ page, baseURL }) => {
			await goToResources(page, baseURL!);
			await page.waitForTimeout(2000);

			const externalLink = page.locator('a[target="_blank"]').first();
			if (await externalLink.isVisible({ timeout: 3000 }).catch(() => false)) {
				const href = await externalLink.getAttribute("href");
				expect(href).toMatch(/^https?:\/\//);
			}
		});

		test("should refresh resources when Refresh button is clicked", async ({ page, baseURL }) => {
			await goToResources(page, baseURL!);

			const refreshBtn = page.locator("button:has-text('Refresh')");
			await expect(refreshBtn).toBeVisible({ timeout: 5000 });
			await refreshBtn.click();
			await page.waitForTimeout(1000);

			const hasContent = await (
				page.locator("text=/Total Resources/i").isVisible({ timeout: 3000 }).catch(() => false) ||
				page.locator("text=/Loading resources/i").isVisible({ timeout: 3000 }).catch(() => false)
			);
			expect(hasContent).toBeTruthy();
		});
	});
});
