export const AUTH_STORAGE_KEY = 'auth_session';

export type AuthStorageType = 'local' | 'session';

export interface StoredAuthUser {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
}

export interface StoredAuthSession {
  user: StoredAuthUser;
  accessToken: string;
  refreshToken: string;
  storageType: AuthStorageType;
}

function getStorageByType(type: AuthStorageType): Storage {
  return type === 'local' ? window.localStorage : window.sessionStorage;
}

export function saveAuthSession(session: StoredAuthSession): void {
  const storage = getStorageByType(session.storageType);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

  const otherStorage = getStorageByType(session.storageType === 'local' ? 'session' : 'local');
  otherStorage.removeItem(AUTH_STORAGE_KEY);
}

export function loadAuthSession(): StoredAuthSession | null {
  try {
    const localRaw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (localRaw) {
      return JSON.parse(localRaw) as StoredAuthSession;
    }

    const sessionRaw = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (sessionRaw) {
      return JSON.parse(sessionRaw) as StoredAuthSession;
    }
  } catch {
    return null;
  }

  return null;
}

export function clearAuthSession(): void {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

