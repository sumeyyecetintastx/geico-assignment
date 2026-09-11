import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepOnePage extends BasePage {
  private readonly firstNameInput = this.page.locator('#first-name');
  private readonly lastNameInput = this.page.locator('#last-name');
  private readonly postalCodeInput = this.page.locator('#postal-code');
  private readonly continueButton = this.page.locator('#continue');
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async getErrorText(): Promise<string> {
    await expect(this.errorMessage).toBeVisible(this.assertionTimeout);
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }
}
