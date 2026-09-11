import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly inventoryList = this.page.locator('.inventory_list');
  private readonly cartBadge = this.page.locator('.shopping_cart_badge');
  private readonly cartLink = this.page.locator('.shopping_cart_link');
  private readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  private readonly productPrices = this.page.locator('.inventory_item_price');

  constructor(page: Page) {
    super(page);
  }

  async waitForLoad(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/, this.assertionTimeout);
    await expect(this.inventoryList).toBeVisible(this.assertionTimeout);
  }

  private productCard(name: string) {
    return this.page.locator('.inventory_item').filter({ hasText: name });
  }

  async verifyProductListed(name: string): Promise<void> {
    await expect(this.productCard(name)).toBeVisible(this.assertionTimeout);
  }

  async addProductToCart(name: string): Promise<void> {
    await this.productCard(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromCart(name: string): Promise<void> {
    await this.productCard(name).getByRole('button', { name: 'Remove' }).click();
  }

  async getCartBadgeCount(): Promise<string | null> {
    if ((await this.cartBadge.count()) === 0) return null;
    return this.cartBadge.textContent();
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return this.cartBadge.isVisible();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(optionLabel: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((text) => parseFloat(text.replace('$', '')));
  }
}
