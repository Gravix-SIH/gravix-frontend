import { Page, Locator, expect } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly url: string;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly roleSwitch: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;
  readonly heading: Locator;

  constructor(page: Page, baseURL: string) {
    this.page = page;
    this.url = `${baseURL}/register`;
    this.nameInput = page.locator('input[placeholder="John Doe"]');
    this.emailInput = page.locator('input[type="email"], input[placeholder*="example.com"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.roleSwitch = page.locator('[role="switch"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.loginLink = page.locator('a:has-text("Login")');
    this.heading = page.locator("h1:has-text('Create an Account')");
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async setAsCounsellor(counsellor: boolean = true) {
    const isChecked = await this.roleSwitch.getAttribute("aria-checked");
    if ((isChecked === "true") !== counsellor) {
      await this.roleSwitch.click();
    }
  }

  async clickSubmit() {
    await this.submitButton.click();
  }

  async register(name: string, email: string, password: string, asCounsellor: boolean = false) {
    await this.goto();
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    if (asCounsellor) await this.setAsCounsellor(true);
    await this.clickSubmit();
  }

  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}
