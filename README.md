# Sauce Demo BDD Automation

Automated tests for [saucedemo.com](https://www.saucedemo.com), built with **Playwright + TypeScript + Cucumber (Gherkin/BDD)** and the **Page Object Model (POM)**.

Testers with no coding background only ever need to open the `.feature` files in `features/`. All browser logic lives behind reusable step definitions and page objects, which testers don't need to touch.

---

## 1. Framework & language selected, and why

| Choice | Reason |
|---|---|
| **Playwright** (browser engine) | Auto-waits for elements to be actionable before every interaction, which removes most flakiness sources by design. Fast, supports Chromium/Firefox/WebKit, and has first-class TypeScript support. |
| **TypeScript** | Static typing catches mistakes (wrong method name, wrong argument) at compile time, before a test ever runs — important once multiple people contribute step definitions and page objects. |
| **Cucumber (`@cucumber/cucumber`)** | Gherkin (`Given/When/Then`) is plain English. It lets non-coding testers read, write, and extend test *scenarios* by combining existing steps, without touching TypeScript. |
| **Page Object Model** | Isolates *how* to interact with a page (selectors, low-level actions) from *what* a test does. When saucedemo's UI changes, only one page object file needs updating — every feature file and step definition that uses it keeps working. |

**Why not plain Playwright Test (`.spec.ts`) instead of Cucumber?** Playwright Test alone is arguably simpler and has richer built-in tooling (trace viewer, parallel sharding), and would be a reasonable choice for a developer-only team. But the explicit requirement here — testers with no coding experience contributing scenarios — is exactly what Gherkin is for, so Cucumber sits on top of Playwright to get both: readable feature files for testers, and Playwright's reliable engine underneath for developers.

---

## 2. Project structure

```
.
├── features/                     # Gherkin scenarios — the only files testers should edit
│   ├── login.feature
│   ├── inventory.feature
│   ├── checkout.feature
│   └── purchase-flow.feature     # Full end-to-end journey: login → find product → cart → checkout → confirmation
├── src/
│   ├── config/
│   │   ├── env.ts                # Loads & validates .env
│   │   └── users.ts              # Maps short user keys (e.g. "standard") to real credentials
│   ├── pages/                    # Page Object Model — one class per screen
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutStepOnePage.ts
│   │   ├── CheckoutStepTwoPage.ts
│   │   └── CheckoutCompletePage.ts
│   ├── steps/                    # Step definitions — glue between Gherkin and page objects
│   │   ├── login.steps.ts
│   │   ├── inventory.steps.ts
│   │   └── checkout.steps.ts
│   └── support/
│       ├── world.ts              # Custom Cucumber World: holds the Playwright page + page objects
│       └── hooks.ts              # Browser lifecycle, screenshot-on-failure
├── reports/                       # Generated after each run (git-ignored)
├── .env.example                   # Template for credentials — copy to .env
├── .env                           # Real values, git-ignored, never committed
├── cucumber.js                    # Cucumber CLI configuration
├── tsconfig.json
└── package.json
```

---

## 3. Prerequisites

- **Node.js 18+** (an `.nvmrc` pinning Node 20 is included). Pick whichever install path matches your OS:

  **macOS**
  - With [Homebrew](https://brew.sh): `brew install node`
  - Or with [nvm](https://github.com/nvm-sh/nvm): install nvm, then `nvm install 20 && nvm use`
  - Or download the installer from [nodejs.org](https://nodejs.org)

  **Windows**
  - With [winget](https://learn.microsoft.com/windows/package-manager/winget/) (built into Windows 10/11): `winget install OpenJS.NodeJS.LTS`
  - Or with [nvm-windows](https://github.com/coreybutler/nvm-windows) (a separate tool from macOS/Linux `nvm`, needed because that one doesn't run on Windows): install it, then `nvm install 20` and `nvm use 20`
  - Or download the installer from [nodejs.org](https://nodejs.org)
  - Run the commands below in **PowerShell** or **Git Bash**, not `cmd.exe` — a couple of the setup commands (e.g. copying `.env.example`) rely on Unix-style syntax that `cmd.exe` doesn't support natively.

  Verify on either OS with:
  ```bash
  node -v   # should print v18.x or higher
  npm -v
  ```

- **Git** — [git-scm.com](https://git-scm.com/downloads) (macOS: often preinstalled or via `brew install git`; Windows: installing Git for Windows also gives you Git Bash, recommended for running the commands in this README).

### Recommended VS Code extensions

Listed in `.vscode/extensions.json` — VS Code will prompt to install them when you open this folder:

- **Cucumber (Gherkin) Full Support** — syntax highlighting, autocomplete of existing steps, and "go to step definition" from a `.feature` file. This is the main tool non-coding testers use.
- **Playwright Test for VSCode** — run/debug tests and view traces from the editor.
- **ESLint** — inline linting for the TypeScript code.

---

## 4. Installation

```bash
# 1. Install dependencies
npm install

# 2. Install the Playwright browser binary (Chromium)
# Works on macOS and Windows:
npm run install:browsers
# On Linux (including Linux CI runners), use this instead — it also
# installs the OS-level system libraries Chromium needs:
# npm run install:browsers:linux-ci

# 3. Create your local environment file
# macOS / Linux / Git Bash / PowerShell:
cp .env.example .env
# Windows cmd.exe, use this instead:
# copy .env.example .env
```

`.env` already ships with saucedemo.com's publicly documented demo accounts and the shared password (`secret_sauce`), so the defaults work out of the box. `.env` is listed in `.gitignore` — it is never committed, which is the mechanism requested for keeping credentials out of version control. If credentials ever change, only `.env` needs updating; no test code changes.

### Multiple environments (QA / staging / production, etc.)

Once this suite needs to run against more than one environment, don't reuse a single `.env` and hand-edit it before every run — that's error-prone (easy to accidentally run against the wrong environment, or commit a swap by mistake) and doesn't scale to CI, where different jobs may target different environments at the same time.

The standard convention instead is one **self-contained** file per environment, named `.env.<environment>`:

```
.env.qa            # QA environment credentials & URL
.env.stg           # Staging environment credentials & URL
.env.prod          # Production / smoke-test environment (if ever needed)
```

Each file holds the *complete* set of variables for that environment (copy `.env.example` as the starting point for each one) — not just the differences from `.env`, to keep things simple and avoid needing to reason about layered overrides.

This framework already supports it: set `TEST_ENV` to the suffix you want, and `src/config/env.ts` loads `.env.<TEST_ENV>` instead of the default `.env`:

```bash
# macOS / Linux
TEST_ENV=qa npm test

# Windows PowerShell
$env:TEST_ENV="qa"; npm test

# Cross-platform (uses the cross-env dependency already installed)
npx cross-env TEST_ENV=qa npm test
```

If `TEST_ENV` is set but the matching file doesn't exist, the framework fails fast with a clear error instead of silently falling back to the wrong environment. Every `.env.<name>` file (and its own `.env.<name>.example` template, if you add one) is already covered by `.gitignore` — the same "never commit real credentials" rule applies no matter how many environments are added.

---

## 5. Running the tests

```bash
npm test                 # headless run of every feature
npm run test:headed      # same, but with a visible browser window (useful for debugging)
npm run test:tags -- "@e2e"     # run only the tagged scenarios, e.g. purchase-flow.feature's @e2e scenario
```

After a run, open the HTML report:

```bash
npm run report:open
```

or open `reports/cucumber-report.html` directly in a browser. A machine-readable `reports/cucumber-report.json` is also produced, for CI integration later.

### How a tester (no coding experience) adds a new scenario

1. Open the relevant file in `features/` (e.g. `inventory.feature`).
2. Start typing `Given`, `When`, or `Then` — the Cucumber VS Code extension will suggest existing step phrases (e.g. `I add the product "..." to the cart`).
3. Compose a new scenario by combining existing steps and filling in the quoted values.
4. Save, then run `npm test` and check the HTML report.
5. If no existing step covers what's needed, note the missing phrase for a developer to implement once as a new reusable step — after that, any tester can reuse it in any feature file.

### Verified run

This suite was installed and run end-to-end against the live site on 2026-09-10: **13/13 scenarios, 48/48 steps passed** (Node 20.20.2, npm 10.8.2, installed via `nvm`). One real issue surfaced and was fixed during that run — see the note below.

**Known gotcha: `performance_glitch_user` and timeouts.** saucedemo.com's `performance_glitch_user` account deliberately delays ~5 seconds after login to simulate a slow backend. Two *different* default timeouts had to be raised to accommodate it: Cucumber's own per-step timeout (default 5s, set in `src/support/hooks.ts` via `setDefaultTimeout`) and Playwright's `expect()` assertion timeout (also defaults to 5s, and is *not* covered by `context.setDefaultTimeout()` — it's applied explicitly per-assertion via `BasePage.assertionTimeout`, sourced from `DEFAULT_TIMEOUT` in `.env`). If you introduce new page objects with `expect(...)` assertions, use `this.assertionTimeout` on them for the same reason.

---

## 6. Assumptions

- The exercise's "one password for several roles" setup refers to saucedemo.com's documented test accounts (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`), all using password `secret_sauce`. These are public, non-sensitive demo credentials; the `.env` mechanism is implemented exactly as requested (real values are still git-ignored) even though there's no actual secrecy need for this particular site.
- "Automating a few tests" was interpreted as: solid coverage of login (the explicit starting point) plus one additional page per major flow (inventory/cart, checkout) to demonstrate that the Page Object Model and step-reuse pattern scale beyond a single page — not as a request for full regression coverage of saucedemo.com.
- Chromium is the default target browser (fastest, most common CI choice); Firefox/WebKit are already wired up via Playwright and can be selected with the `BROWSER` variable in `.env` without any code changes.
- Tests run against the public production site (`https://www.saucedemo.com`); there is no separate staging environment for this exercise.
- CSS selectors/`data-test` attributes used in the page objects reflect saucedemo.com's structure at the time of writing. If the site's markup changes, only the page object files need updating.
- No CI pipeline was set up, since none was requested — but the framework is structured so that adding one (e.g. GitHub Actions running `npm test` on push) is a small, self-contained addition (see §8).

---

## 7. Validation, synchronization, and failure handling

**Validation (assertions).** All assertions use Playwright's `expect` from `@playwright/test`. These are "web-first" assertions: `expect(locator).toBeVisible()` doesn't just check the DOM once — it retries automatically until the condition is true or a timeout is reached. For values that change asynchronously and aren't tied to a single locator (e.g. the cart badge count), `expect.poll(...)` is used, which re-runs the provided function until it matches.

**Synchronization / waiting.** No hard-coded `sleep()` calls are used anywhere in this project. Two mechanisms handle timing instead:
1. **Playwright's built-in auto-waiting** — every action (`.click()`, `.fill()`, `.selectOption()`) automatically waits for its target element to be visible, stable, and enabled before acting.
2. **Explicit web-first assertions at transition points** — e.g. after login, `InventoryPage.waitForLoad()` asserts on the URL and on the inventory list becoming visible, so a step never proceeds while the previous page is still transitioning. This is the pattern used instead of arbitrary waits, and it fails fast with a clear message when something doesn't load in time (`DEFAULT_TIMEOUT` in `.env`, default 10s).

**Failure handling.**
- Each scenario runs in its own Playwright `BrowserContext` (fresh cookies/storage), created in a Cucumber `Before` hook and torn down in `After` — one scenario's failure or leftover state can never bleed into the next.
- On any failed step, the `After` hook captures a full-page screenshot and attaches it directly to the Cucumber report (visible in `reports/cucumber-report.html`), so a tester can see exactly what the screen looked like at the moment of failure without re-running anything.
- Teardown (`page.close()` / `context.close()`) happens in `After` regardless of pass/fail, so a failure never leaks an open browser process.
- Assertion failures produce a clear diffed message (expected vs. actual) from Playwright's `expect`, surfaced directly in the Cucumber output — no custom try/catch wrapping was added, since it would only obscure Playwright's own well-formed error messages.

---

## 8. Scaling to hundreds of tests

The structure above was chosen specifically so it holds up at scale; the changes needed to get there are additive, not a rewrite:

- **Organize by domain, not by size.** Keep one `.feature` file per user-facing capability (already the pattern: `login`, `inventory`, `checkout`) and one page object per screen. As the app grows, this naturally becomes a folder per domain (e.g. `features/checkout/`, `src/pages/checkout/`) instead of one flat list.
- **Tag everything.** Add Cucumber tags (`@smoke`, `@regression`, `@checkout`, `@wip`) to scenarios so any subset can be run independently — fast smoke suite on every PR, full regression nightly. `npm run test:tags -- "@smoke"` already demonstrates the mechanism.
- **Parallelize.** `cucumber-js` supports `--parallel <n>`, and each scenario already gets its own isolated browser context — no shared state stands in the way of running many scenarios concurrently.
- **Keep step definitions generic and small in number.** The goal is a shared vocabulary (maybe 100–200 reusable step phrases) that combine to express thousands of scenarios — not one bespoke step per scenario. Code review on new step definitions should specifically check "could this reuse an existing step instead?"
- **Split fixtures/test data from `.env`.** A handful of shared login credentials belongs in `.env` as done here. Hundreds of tests will need richer, scenario-specific test data (e.g. product catalogs, order fixtures) — that should move to versioned JSON/TS fixture files under `src/fixtures/`, keeping `.env` reserved for secrets/environment config only.
- **Add a thin API layer for setup where possible.** For a real (non-demo) application, seeding state via API calls instead of clicking through the UI in `Given` steps keeps hundreds of scenarios fast and independent of unrelated UI flows.
- **CI integration and reporting.** Run the suite in GitHub Actions (or similar) on every PR, publish the HTML report as a build artifact, and consider a dashboard-style reporter (e.g. Allure) once historical trend/flakiness data becomes valuable.
- **Flaky-test quarantine.** Tag known-flaky scenarios (`@flaky`) and exclude them from the required PR gate while tracking them separately, rather than letting them erode trust in the whole suite.
- **Lint the Gherkin, not just the TypeScript.** Tools like `gherkin-lint` catch inconsistent step phrasing before it causes step-definition duplication — important once many non-coders are contributing scenarios independently.
