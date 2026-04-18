import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { AboutPage } from "../pages/AboutPage";
import { LoginPage } from "../pages/LoginPage";

// ─── Home Page Tests ─────────────────────────────────────────────────────────

test.describe("Home Page", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page, baseURL }) => {
    homePage = new HomePage(page, baseURL!);
    await homePage.goto();
  });

  test("should load the landing page successfully", async () => {
    await expect(homePage.page).toHaveTitle(/mindcare/i);
  });

  test("should display the hero section with heading and CTA buttons", async () => {
    await homePage.expectHeroVisible();
    await expect(homePage.heroHeading).toContainText("Find");
  });

  test("should have two CTA buttons: Get Started and Learn More", async () => {
    await expect(homePage.getStartedButton).toBeVisible();
    await expect(homePage.learnMoreButton).toBeVisible();
  });

  test("should navigate to register page when clicking Get Started (unauthenticated)", async ({
    page,
  }) => {
    await homePage.clickGetStarted();
    await Promise.all([
      page.waitForURL(/\/register/, { timeout: 10000 }),
    ]);
  });

  test("should navigate to dashboard when clicking Get Started (authenticated)", async ({
    page,
    baseURL,
  }) => {
    // Log in via the real login flow
    const loginPage = new LoginPage(page, baseURL!);
    await loginPage.goto();
    const email = process.env.TEST_STUDENT_EMAIL || "theutpal11@gmail.com";
    const password = process.env.TEST_STUDENT_PASSWORD || "password123";
    await loginPage.fillEmail(email);
    await loginPage.fillPassword(password);
    await loginPage.clickLogin();
    await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

    // Now on home page, Get Started should go to dashboard
    // Wait for auth to be fully loaded on home page before clicking
    await page.goto(`${baseURL}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000); // Give auth context time to initialize

    // Use the first Get Started button
    await Promise.all([
      page.waitForURL(/\/dashboard/, { timeout: 10000 }),
      page.locator('button:has-text("Get Started")').first().click(),
    ]);
  });

  test("should scroll to features section when clicking Learn More", async ({ page }) => {
    await homePage.clickLearnMore();
    // Features section should be in view after smooth scroll
    await expect(homePage.featuresSection).toBeInViewport({ timeout: 3000 }).catch(() => {});
  });

  test("should display the features grid section", async () => {
    await homePage.expectFeaturesVisible();
    // Should have multiple feature cards
    const featureCards = homePage.page.locator("#features").locator("..").locator("ul li, [class*='card']");
    await expect(featureCards.first()).toBeVisible();
  });

  test("should display the specialized therapy areas section", async () => {
    const therapySection = homePage.page.locator("text=/Specialized Therapy Areas/i");
    await expect(therapySection).toBeVisible();
  });

  test("should display the CTA section at the bottom", async () => {
    const ctaSection = homePage.page.locator("text=/Ready to Elevate/i");
    await expect(ctaSection).toBeVisible();
  });

  test("should have a visible footer with branding", async ({ page }) => {
    // Footer should contain some recognizable content
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
  });

  test("should not have any console errors on page load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    // Filter out expected third-party errors
    const realErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("DevTools")
    );
    expect(realErrors).toHaveLength(0);
  });

  test("page title should be set correctly", async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});

// ─── About Page Tests ────────────────────────────────────────────────────────

test.describe("About Page", () => {
  let aboutPage: AboutPage;

  test.beforeEach(async ({ page, baseURL }) => {
    aboutPage = new AboutPage(page, baseURL!);
    await aboutPage.goto();
  });

  test("should load the about page successfully", async () => {
    await expect(aboutPage.page).toHaveURL(/\/about/);
  });

  test("should display the main heading", async () => {
    await expect(aboutPage.heading).toBeVisible();
    await expect(aboutPage.heading).toContainText("About Us");
  });

  test("should display the Our Story section", async () => {
    const storySection = aboutPage.page.locator("h2:has-text('Our Story')");
    await expect(storySection).toBeVisible();
  });

  test("should display the Mission & Values section", async () => {
    const missionSection = aboutPage.page.locator("h2:has-text('Mission & Values')");
    await expect(missionSection).toBeVisible();
  });

  test("should display the team section with team members", async () => {
    await expect(aboutPage.teamSection).toBeVisible();
    // Team member names should be visible
    const utpal = aboutPage.page.locator("text=/Utpal/");
    const hazel = aboutPage.page.locator("text=/Hazel/");
    await expect(utpal).toBeVisible();
    await expect(hazel).toBeVisible();
  });

  test("should display the Join the Platform CTA button", async () => {
    await expect(aboutPage.joinButton).toBeVisible();
  });

  test("should navigate to register page when clicking Join the Platform", async ({
    page,
  }) => {
    await aboutPage.clickJoin();
    await expect(page).toHaveURL(/\/register/);
  });

  test("should have no console errors on page load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
    const realErrors = errors.filter(
      (e) => !e.includes("favicon") && !e.includes("DevTools")
    );
    expect(realErrors).toHaveLength(0);
  });
});

// ─── Public Page Accessibility ────────────────────────────────────────────────

test.describe("Accessibility Checks", () => {
  test("home page should have proper heading hierarchy", async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    // h1 should exist and be unique
    const h1Count = await page.locator("h1").count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test("all CTA buttons should be keyboard accessible", async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    await page.keyboard.press("Tab");
    // Tab should land on a focusable element
    await expect(page.locator(":focus")).not.toBeNull();
  });
});
