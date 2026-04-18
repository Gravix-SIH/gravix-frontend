import { Page, Locator, expect } from "@playwright/test";

export class AboutPage {
  readonly page: Page;
  readonly url: string;
  readonly heading: Locator;
  readonly joinButton: Locator;
  readonly teamSection: Locator;

  constructor(page: Page, baseURL: string) {
    this.page = page;
    this.url = `${baseURL}/about`;
    this.heading = page.locator("h1:has-text('About Us')");
    this.joinButton = page.locator("button:has-text('Join the Platform')");
    this.teamSection = page.locator("h2:has-text('Meet the Team')");
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async clickJoin() {
    await this.joinButton.click();
  }

  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.teamSection).toBeVisible();
  }
}
