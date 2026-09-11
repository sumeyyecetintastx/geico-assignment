import { Page } from '@playwright/test';
import { env } from '../config/env';

// Common ground for every page object. Kept intentionally small: shared
// helpers go here, page-specific locators/actions belong in the subclass.
export abstract class BasePage {
  // Explicit timeout for web-first assertions, since Playwright's `expect()`
  // has its own default (5s) independent of context.setDefaultTimeout().
  // saucedemo.com's "performance_glitch_user" needs this headroom on login.
  protected readonly assertionTimeout = { timeout: env.DEFAULT_TIMEOUT };

  constructor(protected readonly page: Page) {}
}
