# Project To-Do List

Track progress here. Items below reflect the build order used for this framework.

- [x] Initialize project (git repo, `package.json`, `tsconfig.json`, folder structure)
- [x] Choose framework/language and document the decision (Playwright + TypeScript + Cucumber)
- [x] Set up environment variables (`.env`, `.env.example`, `.gitignore`)
- [x] Build Page Object Model classes (Login, Inventory, Cart, Checkout x3)
- [x] Write Gherkin feature files (login, inventory/cart, checkout)
- [x] Implement reusable step definitions wired to page objects
- [x] Configure the Cucumber + Playwright runner (custom World, hooks, `cucumber.js`)
- [x] Define synchronization/waiting strategy (Playwright auto-waiting + web-first assertions)
- [x] Define failure handling strategy (screenshot-on-failure, guaranteed teardown, retries)
- [x] Configure HTML/JSON reporting
- [x] Write README (install, tools, usage, assumptions, approach, scaling plan)
- [x] Install Node.js locally (installed via nvm — Node 20.20.2 / npm 10.8.2)
- [x] Run `npm install` and `npm run install:browsers`
- [x] Run the full suite locally and confirm all scenarios pass against the live site (13/13 passed)
- [x] Add end-to-end purchase flow scenario (`features/purchase-flow.feature`), covering all 10 requested checkpoints — 14/14 scenarios, 62/62 steps passed
- [ ] (Optional) Wire the suite into CI (GitHub Actions) once it runs green locally

## End-to-end purchase flow — 10 requested checkpoints (all covered in `features/purchase-flow.feature`)

- [x] 1. Log into the application using a valid test account
- [x] 2. Verify that login was successful
- [x] 3. Locate a specific product
- [x] 4. Add the product to the shopping cart
- [x] 5. Verify that the correct product was added to the cart
- [x] 6. Proceed through the checkout process
- [x] 7. Enter the required customer information
- [x] 8. Verify that the correct product and expected price are displayed before completing the order
- [x] 9. Complete the order
- [x] 10. Verify that the application confirms the order was successfully completed

## Adding a new test scenario later (for non-coding testers)

- [ ] Open the relevant `.feature` file (or create a new one in `features/`)
- [ ] Write the scenario using existing step phrasing where possible
- [ ] If a needed step doesn't exist yet, flag it for a developer to add one reusable step definition
- [ ] Run `npm test` and check `reports/cucumber-report.html`
