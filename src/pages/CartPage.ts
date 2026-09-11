import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItems = this.page.locator('.cart_item');
  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');

  constructor(page: Page) {
    super(page);
  }

  async isProductListed(name: string): Promise<boolean> {
    return this.cartItems.filter({ hasText: name }).isVisible();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
