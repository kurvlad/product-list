import { loadAuthSession } from '../features/auth/authStorage';

export function hasStoredSession(): boolean {
  const session = loadAuthSession();
  return Boolean(session && session.accessToken);
}

