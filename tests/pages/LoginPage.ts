import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly url: string;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly anonymousButton: Locator;
  readonly registerLink: Locator;
  readonly heading: Locator;

  constructor(page: Page, baseURL: string) {
    this.page = page;
    this.url = `${baseURL}/login`;
    this.emailInput = page.locator('input[type="email"], input[placeholder*="example.com"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.anonymousButton = page.locator('button:has-text("Anonymous")');
    this.registerLink = page.locator('a:has-text("Register")');
    this.heading = page.locator("h1:has-text('Login')");
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickAnonymous() {
    await this.anonymousButton.click();
  }

  async login(email: string, password: string) {
    await this.goto();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectErrorMessage(contains: string) {
    await expect(this.page.locator("[role='alert'], .toast, [data-sonner-toaster]")).toContainText(contains, { timeout: 5000 });
  }
}
