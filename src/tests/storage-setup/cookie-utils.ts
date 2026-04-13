import { getPage } from '#utils/page-utils';
import { logger } from '#setup/custom-logger';
import { Cookie, LocalStorage, SessionData } from '#storage-setup/session-types';
import * as fs from 'fs';
import path from 'path';

// ── Configuration ──────────────────────────────────────────────────────────────
// Base URL from env or fallback
const BASE_URL = process.env.BASE_URL ?? 'https://ecommerce-playground.lambdatest.io';
// Directory where per-user storage state JSON files are saved
export const STORAGE_STATE_PATH = path.resolve('storage-state');
// Minimum expiration time (in seconds) for a cookie to be considered valid
const DEFAULT_EXPIRATION_THRESHOLD = 120;
// Name of the login cookie that will be checked for expiration
const COOKIE_NAME = 'OCSESSID';
// Domain of the cookie — leave empty to skip domain check
const COOKIE_DOMAIN = '';
// Path of the cookie — '/' skips path check
const COOKIE_PATH = '/';
// Origin URL for localStorage matching
const ORIGIN_URL = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

// ── User type ──────────────────────────────────────────────────────────────────
export interface User {
  username: string;
  email: string;
  password: string;
}

// ── Cookie validation ──────────────────────────────────────────────────────────

/**
 * Checks if a session cookie is still valid based on its expiration time.
 * A cookie is valid if its remaining lifetime exceeds the threshold (default 120s).
 */
export function isSessionCookieValid(
  cookie: Cookie,
  options?: { expirationThreshold?: number },
): boolean {
  const { expirationThreshold = DEFAULT_EXPIRATION_THRESHOLD } = options ?? {};
  const cookieExpirationTime = cookie.expires;

  // Session cookies (expires -1) have no expiry — check file age instead.
  // Server-side sessions can expire even though the cookie has no expiry timestamp.
  if (cookie.expires === undefined || cookie.expires === -1) {
    logger.info(`Cookie name: ${cookie.name} is a session cookie (no expiry). Checking file age instead.`);
    return false; // Always re-login for session cookies since server may have expired them
  }

  const currentTimeInSeconds = Date.now() / 1000;
  const timeLeftForExpiration = cookieExpirationTime - currentTimeInSeconds;

  if (timeLeftForExpiration > expirationThreshold) {
    logger.info(`Cookie name: ${cookie.name} is valid for the next ${formatTime(timeLeftForExpiration)}.`);
    return true;
  } else if (timeLeftForExpiration > 0) {
    logger.error(
      `Cookie name: ${cookie.name} will expire in ${formatTime(timeLeftForExpiration)} but minimum time set for cookie to be valid is ${formatTime(expirationThreshold)}.`,
    );
  } else {
    logger.error(`Cookie name: ${cookie.name} expired ${formatTime(Math.abs(timeLeftForExpiration))} ago.`);
  }
  return false;
}

/**
 * Checks if a user's stored auth state (on disk) still has a valid session cookie.
 * Returns false if the file doesn't exist, can't be read, or cookies are expired.
 */
export function isUserStorageStateValid(
  user: User,
  options?: { cookieName?: string; expirationThreshold?: number; exact?: boolean; domain?: string; path?: string },
): boolean {
  const defaultOptions = {
    cookieName: COOKIE_NAME,
    domain: COOKIE_DOMAIN,
    path: COOKIE_PATH,
    expirationThreshold: DEFAULT_EXPIRATION_THRESHOLD,
    exact: false,
  };
  const effectiveOptions = { ...defaultOptions, ...options };
  const userPath = getUserAuthPath(user);

  if (!fs.existsSync(userPath)) {
    logger.error(`Cookie file: ${userPath} doesn't exist.`);
    return false;
  }

  try {
    const storageState = JSON.parse(fs.readFileSync(userPath, 'utf-8')) as SessionData;
    const validCookies = storageState.cookies.filter(
      cookie =>
        (cookie.name === effectiveOptions.cookieName ||
          (!effectiveOptions.exact && cookie.name.includes(effectiveOptions.cookieName))) &&
        (!effectiveOptions.domain || cookie.domain === effectiveOptions.domain) &&
        (effectiveOptions.path === '/' || cookie.path === effectiveOptions.path),
    );

    if (validCookies.length === 0) {
      logger.error(
        `No valid cookies found for user: ${user.username} with criteria: ${JSON.stringify(effectiveOptions)}`,
      );
      return false;
    }
    return validCookies.some(cookie => isSessionCookieValid(cookie, effectiveOptions));
  } catch (error) {
    logger.error(`An error occurred while reading the storage file: ${String(error)}`);
    return false;
  }
}

// ── Path helpers ───────────────────────────────────────────────────────────────

/** Returns the file path for a user's stored auth state JSON. Accepts full User or just { username } */
export function getUserAuthPath(user: User | { username: string }): string {
  const username = typeof user === 'string' ? user : user.username;
  return path.join(STORAGE_STATE_PATH, `${username}.json`);
}

// ── Injecting stored state into browser context ────────────────────────────────

/**
 * Reads a user's saved storage state from disk and injects cookies + localStorage
 * into the current Playwright browser context.
 */
export async function addUserCookiesAndStorage(user: User, options?: { originUrl?: string }) {
  const originUrl = options?.originUrl ?? ORIGIN_URL;
  const userData = JSON.parse(fs.readFileSync(getUserAuthPath(user), 'utf-8')) as SessionData;
  const cookies: Cookie[] = userData.cookies;
  const page = getPage();

  logger.info(`Adding cookies for user ${user.username}`);
  await page.context().addCookies(cookies);

  const originEntry = userData.origins.find(origin => origin.origin === originUrl);
  const appLocalStorage: LocalStorage[] = originEntry?.localStorage ?? [];

  if (appLocalStorage.length > 0) {
    logger.info(`Adding all the LocalStorage items for user ${user.username}`);
    for (const item of appLocalStorage) {
      await page.evaluate(
        ({ key, value }) => {
          localStorage.setItem(key, value);
        },
        { key: item.name, value: item.value },
      );
    }
  } else {
    logger.error(`No LocalStorage found for origin: ${originUrl}`);
  }
}

// ── Utility helpers ────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const sign = seconds < 0 ? '-' : '';
  seconds = Math.abs(seconds);

  const days = Math.floor(seconds / 86400);
  seconds -= days * 86400;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);

  let timeString = sign;
  if (days > 0) timeString += `${days}d `;
  if (hours > 0 || days > 0) timeString += `${hours}h `;
  timeString += `${minutes}m ${remainingSeconds}s`;

  return timeString.trim();
}

/** Extracts the domain from a URL for cookie matching */
export function getURLDomain(url: string): string {
  const hostname = new URL(url).hostname;
  const parts = hostname.split('.');

  if (hostname.startsWith('www.')) return hostname;
  if (parts.length > 2) return `.${parts.slice(-2).join('.')}`;
  return parts.join('.');
}
