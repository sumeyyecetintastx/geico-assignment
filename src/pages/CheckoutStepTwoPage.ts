import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  private readonly finishButton = this.page.locator('#finish');

  constructor(page: Page) {
    super(page);
  }

  private lineItem(name: string) {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  async verifyProduct(name: string, price: string): Promise<void> {
    const item = this.lineItem(name);
    await expect(item).toBeVisible(this.assertionTimeout);
    await expect(item.locator('.inventory_item_price')).toHaveText(price, this.assertionTimeout);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
