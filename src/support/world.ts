import { World as CucumberWorld, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

// One CustomWorld instance is created per scenario by Cucumber. It carries
// the Playwright session for that scenario plus lazily-built, cached page
// objects so step definitions never construct pages themselves.
export class CustomWorld extends CucumberWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  private _loginPage?: LoginPage;
  private _inventoryPage?: InventoryPage;
  private _cartPage?: CartPage;
  private _checkoutStepOne?: CheckoutStepOnePage;
  private _checkoutStepTwo?: CheckoutStepTwoPage;
  private _checkoutComplete?: CheckoutCompletePage;

  constructor(options: IWorldOptions) {
    super(options);
  }

  get loginPage(): LoginPage {
    return (this._loginPage ??= new LoginPage(this.page));
  }

  get inventoryPage(): InventoryPage {
    return (this._inventoryPage ??= new InventoryPage(this.page));
  }

  get cartPage(): CartPage {
    return (this._cartPage ??= new CartPage(this.page));
  }

  get checkoutStepOne(): CheckoutStepOnePage {
    return (this._checkoutStepOne ??= new CheckoutStepOnePage(this.page));
  }

  get checkoutStepTwo(): CheckoutStepTwoPage {
    return (this._checkoutStepTwo ??= new CheckoutStepTwoPage(this.page));
  }

  get checkoutComplete(): CheckoutCompletePage {
    return (this._checkoutComplete ??= new CheckoutCompletePage(this.page));
  }
}

setWorldConstructor(CustomWorld);
