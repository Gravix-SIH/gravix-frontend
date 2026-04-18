import { Page, Locator, expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly url: string;
  readonly heroHeading: Locator;
  readonly getStartedButton: Locator;
  readonly learnMoreButton: Locator;
  readonly featuresSection: Locator;
  readonly navLoginLink: Locator;

  constructor(page: Page, baseURL: string) {
    this.page = page;
    this.url = baseURL;
    this.heroHeading = page.locator("h1");
    this.getStartedButton = page.locator("button:has-text('Get Started')").first();
    this.learnMoreButton = page.locator("button:has-text('Learn More')").first();
    this.featuresSection = page.locator("#features");
    this.navLoginLink = page.locator('a:has-text("Login")');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }

  async clickLearnMore() {
    await this.learnMoreButton.click();
  }

  async expectHeroVisible() {
    await expect(this.heroHeading).toBeVisible();
    await expect(this.getStartedButton).toBeVisible();
  }

  async expectFeaturesVisible() {
    await expect(this.featuresSection).toBeVisible();
  }
}
