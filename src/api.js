/**
 * Thin fetch helpers over the same Worker API the web app uses.
 * Auth is the httpOnly `auth_token` cookie set by the Google OAuth flow.
 * On iOS/Android, RN's networking stack persists cookies automatically, and
 * react-native-webview's `sharedCookiesEnabled` puts the login cookie into
 * that same store — so plain fetch stays authenticated after the WebView login.
 */

export const BASE_URL = 'https://en.huyab.click';

const UNAUTHORIZED = Symbol('unauthorized');

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    ...options,
  });
  if (res.status === 401) {
    const err = new Error('Unauthorized');
    err[UNAUTHORIZED] = true;
    throw err;
  }
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : null;
  if (!res.ok) throw new Error((data && data.error) || `Lỗi ${res.status}`);
  return data;
}

export function isUnauthorized(err) {
  return !!(err && err[UNAUTHORIZED]);
}

export const api = {
  me: () => request('/api/auth/me'),
  lessons: () => request('/api/lessons'),
  flashcardsDueCount: () => request('/api/flashcards/due-count'),
  vocab: (level, lessonId) => {
    const q = new URLSearchParams();
    if (level) q.set('level', level);
    if (lessonId) q.set('lessonId', String(lessonId));
    return request(`/api/vocab${q.toString() ? `?${q}` : ''}`);
  },
  savedVocab: () => request('/api/vocab/saved'),
  saveVocab: (id, save) =>
    request(`/api/vocab/${id}/save`, { method: 'POST', body: JSON.stringify({ save }) }),
  reviewVocab: (id, quality) =>
    request(`/api/vocab/${id}/review`, { method: 'POST', body: JSON.stringify({ quality }) }),

  lessonDetail: (id) => request(`/api/lessons/${id}`),
  learningStats: () => request('/api/stats'),
  rankings: () => request('/api/rankings'),
  weeklyRankings: () => request('/api/rankings/weekly'),
  lookupWord: (term) => request(`/api/word/lookup?term=${encodeURIComponent(term)}`),
  translationToday: () => request('/api/translation/today'),
  reviewTranslation: (vietnamese, translation) =>
    request('/api/translation/review', {
      method: 'POST',
      body: JSON.stringify({ vietnamese, translation }),
    }),
  saveLookedUpWord: (word) =>
    request('/api/word/save', { method: 'POST', body: JSON.stringify(word) }),
};

export const GOOGLE_LOGIN_URL = `${BASE_URL}/api/auth/google`;
export const LOGOUT_URL = `${BASE_URL}/api/auth/logout`;
