import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// TEST_ENV picks which environment file to load, e.g. TEST_ENV=qa -> .env.qa,
// TEST_ENV=stg -> .env.stg. Falls back to plain ".env" when unset, so the
// single-environment workflow (see .env.example) keeps working unchanged.
const testEnv = process.env.TEST_ENV;
const envFileName = testEnv ? `.env.${testEnv}` : '.env';
const envFilePath = path.resolve(__dirname, '../../', envFileName);

if (testEnv && !fs.existsSync(envFilePath)) {
  throw new Error(
    `TEST_ENV="${testEnv}" was set but "${envFileName}" does not exist at the project root. ` +
      `Create it (copy .env.example to ${envFileName} and fill in that environment's values), ` +
      `or unset TEST_ENV to fall back to the default ".env".`,
  );
}

dotenv.config({ path: envFilePath });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Copy .env.example to .env and fill in the values.`,
    );
  }
  return value;
}

export const env = {
  BASE_URL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  PASSWORD: required('PASSWORD'),
  STANDARD_USER: required('STANDARD_USER'),
  LOCKED_OUT_USER: required('LOCKED_OUT_USER'),
  PROBLEM_USER: required('PROBLEM_USER'),
  PERFORMANCE_GLITCH_USER: required('PERFORMANCE_GLITCH_USER'),
  ERROR_USER: required('ERROR_USER'),
  VISUAL_USER: required('VISUAL_USER'),
  BROWSER: (process.env.BROWSER ?? 'chromium') as 'chromium' | 'firefox' | 'webkit',
  HEADLESS: (process.env.HEADLESS ?? 'true').toLowerCase() !== 'false',
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT ?? 15000),
};
