/**
 * Storage State Setup — saves per-user login storage states to disk.
 *
 * This file runs as a Playwright "setup" project before the main test suite.
 * It logs in each user, saves their cookies + localStorage to a JSON file,
 * and skips the login if the existing stored session is still valid.
 *
 * Configure this as a setup project in playwright.config.ts:
 *   projects: [
 *     { name: 'login-setup', testDir: './src/tests/storage-setup', testMatch: 'login-storage-setup.ts' },
 *     { name: 'chromium', dependencies: ['login-setup'], ... },
 *   ]
 */
import { test as setup } from '#pagesetup';
import { saveStorageState, navigateToURL, waitForPageLoadState } from '#utils/page-utils';
import { logger } from '#setup/custom-logger';
import { getUserAuthPath, isUserStorageStateValid, User, STORAGE_STATE_PATH } from '#storage-setup/cookie-utils';
import * as fs from 'fs';
import { fill, clickAndNavigate } from '#utils/action-utils';
import { expectPageToHaveTitle } from '#utils/expect-utils';

// ── Test Data ──────────────────────────────────────────────────────────────────

const validUsers: User[] = [
  {
    username: 'default',
    email: process.env.USER_EMAIL ?? 'test@example.com',
    password: process.env.USER_PASSWORD ?? 'password123',
  },
  // Add more users here as needed:
  // { username: 'admin', email: 'admin@example.com', password: 'adminpass' },
];

// ── Locators ───────────────────────────────────────────────────────────────────

const EMAIL_INPUT = "input[name='email']";
const PASSWORD_INPUT = "input[name='password']";
const LOGIN_BTN = "input[type='submit'][value='Login']";

// ── Setup Tests ────────────────────────────────────────────────────────────────

setup.describe.configure({ mode: 'parallel' });

// Ensure storage-state directory exists
if (!fs.existsSync(STORAGE_STATE_PATH)) {
  fs.mkdirSync(STORAGE_STATE_PATH, { recursive: true });
}

validUsers.forEach(user => {
  setup(`Save Login Storage for ${user.username}`, async () => {
    // Skip if existing stored session cookie is still valid
    setup.skip(isUserStorageStateValid(user), `Skipping — storage state for ${user.username} is still valid`);

    logger.info(`Saving ${user.username} Login Storage`);

    // Navigate to login page
    await navigateToURL('/index.php?route=account/login');
    await waitForPageLoadState({ waitUntil: 'domcontentloaded' });

    // Perform login
    await fill(EMAIL_INPUT, user.email);
    await fill(PASSWORD_INPUT, user.password);
    await clickAndNavigate(LOGIN_BTN);

    // Verify login succeeded
    await expectPageToHaveTitle('My Account');

    // Save storage state to per-user JSON file
    await saveStorageState(getUserAuthPath(user));
    logger.info(`Storage state saved for ${user.username} at ${getUserAuthPath(user)}`);
  });
});
