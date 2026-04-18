import { Page, Locator, expect } from "@playwright/test";

export class VerifyEmailPage {
  readonly page: Page;
  readonly url: string;
  readonly codeInputs: Locator[];
  readonly verifyButton: Locator;
  readonly resendButton: Locator;
  readonly heading: Locator;

  constructor(page: Page, baseURL: string) {
    this.page = page;
    this.url = `${baseURL}/verify-email`;
    this.codeInputs = Array.from({ length: 6 }, (_, i) =>
      page.locator(`#code-${i}`)
    );
    this.verifyButton = page.locator("button:has-text('Verify Email')");
    this.resendButton = page.locator("button:has-text('Resend'), a:has-text('Resend')");
    this.heading = page.locator("h1:has-text('Verify Your Email')");
  }

  async goto(email?: string) {
    const url = email ? `${this.url}?email=${encodeURIComponent(email)}` : this.url;
    await this.page.goto(url);
  }

  async fillCode(code: string) {
    const digits = code.replace(/\D/g, "").slice(0, 6).split("");
    for (let i = 0; i < digits.length; i++) {
      await this.codeInputs[i].fill(digits[i]);
    }
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async clickResend() {
    await this.resendButton.click();
  }

  async expectToBeVisible() {
    await expect(this.heading).toBeVisible();
    for (const input of this.codeInputs) {
      await expect(input).toBeVisible();
    }
  }
}
