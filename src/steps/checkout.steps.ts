import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

When('I go to the cart', async function (this: CustomWorld) {
  await this.inventoryPage.openCart();
});

When('I proceed to checkout', async function (this: CustomWorld) {
  await this.cartPage.checkout();
});

Then('the cart should contain the product {string}', async function (this: CustomWorld, name: string) {
  await expect.poll(() => this.cartPage.isProductListed(name)).toBe(true);
});

When(
  'I fill in the checkout information with first name {string}, last name {string}, and postal code {string}',
  async function (this: CustomWorld, firstName: string, lastName: string, postalCode: string) {
    await this.checkoutStepOne.fillInformation(firstName, lastName, postalCode);
  },
);

When('I continue to the overview page', async function (this: CustomWorld) {
  await this.checkoutStepOne.continueToOverview();
});

When('I continue to the overview page without filling in the information', async function (this: CustomWorld) {
  await this.checkoutStepOne.continueToOverview();
});

Then(
  'the checkout overview should show the product {string} with a price of {string}',
  async function (this: CustomWorld, name: string, price: string) {
    await this.checkoutStepTwo.verifyProduct(name, price);
  },
);

When('I finish the checkout', async function (this: CustomWorld) {
  await this.checkoutStepTwo.finish();
});

Then('I should see the order confirmation message {string}', async function (this: CustomWorld, expected: string) {
  const actual = await this.checkoutComplete.getConfirmationText();
  expect(actual).toBe(expected);
});

Then('I should see a checkout error containing {string}', async function (this: CustomWorld, expected: string) {
  const actual = await this.checkoutStepOne.getErrorText();
  expect(actual).toContain(expected);
});
