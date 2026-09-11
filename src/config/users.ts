import { env } from './env';

export type UserKey =
  | 'standard'
  | 'lockedOut'
  | 'problem'
  | 'performanceGlitch'
  | 'error'
  | 'visual';

const usernameByKey: Record<UserKey, string> = {
  standard: env.STANDARD_USER,
  lockedOut: env.LOCKED_OUT_USER,
  problem: env.PROBLEM_USER,
  performanceGlitch: env.PERFORMANCE_GLITCH_USER,
  error: env.ERROR_USER,
  visual: env.VISUAL_USER,
};

export interface Credentials {
  username: string;
  password: string;
}

// Looks up a saucedemo test account by the short key used in feature files
// (e.g. "standard", "lockedOut") and pairs it with the shared password.
export function getCredentials(userKey: string): Credentials {
  const username = usernameByKey[userKey as UserKey];
  if (!username) {
    const validKeys = Object.keys(usernameByKey).join(', ');
    throw new Error(`Unknown user type "${userKey}". Valid options are: ${validKeys}`);
  }
  return { username, password: env.PASSWORD };
}
