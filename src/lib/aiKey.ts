const STORAGE_KEY = 'csi-gemini-key';

export function getApiKey(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

export function setApiKey(key: string): void {
  try {
    if (key) window.localStorage.setItem(STORAGE_KEY, key);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}
