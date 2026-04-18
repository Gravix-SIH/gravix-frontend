import { Page, Locator, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly url: string;
  readonly sidebar: Locator;
  readonly logoutButton: Locator;
  readonly dashboardHeading: Locator;

  constructor(page: Page, baseURL: string) {
    this.page = page;
    this.url = `${baseURL}/dashboard`;
    this.sidebar = page.locator("aside");
    this.logoutButton = page.locator('button:has-text("Logout")');
    this.dashboardHeading = page.locator("h2:has-text('Dashboard')");
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async expectToBeVisible() {
    await expect(this.sidebar).toBeVisible();
    await expect(this.dashboardHeading).toBeVisible();
  }

  async expectUnauthorized() {
    // After logout or without auth, should redirect away from dashboard
    await this.page.waitForURL(/\/(login|register)/, { timeout: 5000 }).catch(() => {});
    expect(this.page.url()).not.toContain("/dashboard");
  }
}
