import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  ITestCaseHookParameter,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser } from '@playwright/test';
import { CustomWorld } from './world';
import { env } from '../config/env';

let browser: Browser;

// Cucumber's own per-step timeout (default 5s) is separate from Playwright's
// action/assertion timeouts (see DEFAULT_TIMEOUT, applied in page objects and
// via context.setDefaultTimeout() below). saucedemo.com's
// "performance_glitch_user" deliberately delays ~5s on login to simulate a
// slow backend, so the step timeout needs enough headroom for that to finish.
setDefaultTimeout(20 * 1000);

// "msedge" isn't a Playwright browser engine of its own — Microsoft Edge is
// Chromium-based, so Playwright launches it through the Chromium driver with
// a "channel" option instead of a dedicated launcher. env.ts already rejects
// any BROWSER value outside chromium/firefox/webkit/msedge, so no further
// fallback is needed here.
function launchBrowser(): Promise<Browser> {
  const options = { headless: env.HEADLESS };
  if (env.BROWSER === 'msedge') {
    return chromium.launch({ ...options, channel: 'msedge' });
  }
  const engines = { chromium, firefox, webkit };
  return engines[env.BROWSER].launch(options);
}

BeforeAll(async function () {
  browser = await launchBrowser();
});

// Every scenario gets its own isolated BrowserContext (fresh cookies/storage)
// so scenarios never leak state into one another, without paying the cost
// of relaunching the whole browser each time.
Before(async function (this: CustomWorld) {
  this.context = await browser.newContext({ baseURL: env.BASE_URL });
  this.context.setDefaultTimeout(env.DEFAULT_TIMEOUT);
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld, { result }: ITestCaseHookParameter) {
  if (result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  await browser?.close();
});
