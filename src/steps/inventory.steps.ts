import { Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Then('I should see the product {string} listed on the products page', async function (this: CustomWorld, name: string) {
  await this.inventoryPage.verifyProductListed(name);
});

When('I add the product {string} to the cart', async function (this: CustomWorld, name: string) {
  await this.inventoryPage.addProductToCart(name);
});

Given('I have added the product {string} to the cart', async function (this: CustomWorld, name: string) {
  await this.inventoryPage.addProductToCart(name);
});

When('I add the following products to the cart:', async function (this: CustomWorld, dataTable: DataTable) {
  const names = dataTable.raw().map((row) => row[0]);
  for (const name of names) {
    await this.inventoryPage.addProductToCart(name);
  }
});

When('I remove the product {string} from the cart', async function (this: CustomWorld, name: string) {
  await this.inventoryPage.removeProductFromCart(name);
});

Then('the cart badge should show {string}', async function (this: CustomWorld, expected: string) {
  await expect.poll(() => this.inventoryPage.getCartBadgeCount()).toBe(expected);
});

Then('the cart badge should not be visible', async function (this: CustomWorld) {
  await expect.poll(() => this.inventoryPage.isCartBadgeVisible()).toBe(false);
});

When('I sort products by {string}', async function (this: CustomWorld, optionLabel: string) {
  await this.inventoryPage.sortBy(optionLabel);
});

Then('the products should be listed in ascending order of price', async function (this: CustomWorld) {
  const prices = await this.inventoryPage.getProductPrices();
  const sortedAscending = [...prices].sort((a, b) => a - b);
  expect(prices).toEqual(sortedAscending);
});
