import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { getCredentials } from '../config/users';

Given('I am on the Sauce Demo login page', async function (this: CustomWorld) {
  await this.loginPage.open();
});

Given('I am logged in as the {string} user', async function (this: CustomWorld, userKey: string) {
  const { username, password } = getCredentials(userKey);
  await this.loginPage.open();
  await this.loginPage.login(username, password);
  await this.inventoryPage.waitForLoad();
});

When('I log in as the {string} user', async function (this: CustomWorld, userKey: string) {
  const { username, password } = getCredentials(userKey);
  await this.loginPage.login(username, password);
});

When(
  'I log in with username {string} and password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  },
);

Then('I should be redirected to the products page', async function (this: CustomWorld) {
  await this.inventoryPage.waitForLoad();
});

Then('I should see an error message containing {string}', async function (this: CustomWorld, expected: string) {
  const actual = await this.loginPage.getErrorText();
  expect(actual).toContain(expected);
});
