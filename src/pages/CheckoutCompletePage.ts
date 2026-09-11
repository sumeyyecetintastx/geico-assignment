import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  private readonly completeHeader = this.page.locator('.complete-header');

  constructor(page: Page) {
    super(page);
  }

  async getConfirmationText(): Promise<string> {
    await expect(this.completeHeader).toBeVisible(this.assertionTimeout);
    return (await this.completeHeader.textContent())?.trim() ?? '';
  }
}
