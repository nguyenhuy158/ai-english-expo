// node selfcheck.mjs — kiểm tra lớp api xử lý 401 / lỗi / JSON đúng, không cần mạng.
import assert from 'node:assert/strict';

const realFetch = globalThis.fetch;
function stubFetch(status, body, contentType = 'application/json') {
  globalThis.fetch = async () => ({
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => contentType },
    json: async () => body,
  });
}

const { api, isUnauthorized, BASE_URL } = await import('./src/api.js');

assert.equal(BASE_URL, 'https://en.huyab.click');

stubFetch(200, { user: { id: 1, name: 'Huy' } });
assert.deepEqual(await api.me(), { user: { id: 1, name: 'Huy' } });

stubFetch(200, { user: null });
assert.equal((await api.me()).user, null);

stubFetch(401, null);
const unauth = await api.vocab().catch((e) => e);
assert.ok(isUnauthorized(unauth), '401 phải được đánh dấu unauthorized');

stubFetch(500, { error: 'boom' });
const failed = await api.lessons().catch((e) => e);
assert.equal(failed.message, 'boom');
assert.equal(isUnauthorized(failed), false);

stubFetch(503, null, 'text/html');
const nonJson = await api.lessons().catch((e) => e);
assert.equal(nonJson.message, 'Lỗi 503');

globalThis.fetch = realFetch;
console.log('selfcheck ok');

// reviewTranslation gửi đúng path/method/body
{
  let seen;
  globalThis.fetch = async (url, opts) => {
    seen = { url, opts };
    return new Response(JSON.stringify({ corrected: 'I go home', corrections: [], overallFeedback: 'ok' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  };
  const res = await api.reviewTranslation('Tôi về nhà', 'I go home');
  assert.equal(seen.url, 'https://en.huyab.click/api/translation/review');
  assert.equal(seen.opts.method, 'POST');
  assert.deepEqual(JSON.parse(seen.opts.body), { vietnamese: 'Tôi về nhà', translation: 'I go home' });
  assert.equal(seen.opts.headers['Content-Type'], 'application/json');
  assert.equal(res.corrected, 'I go home');
}
console.log('translate selfcheck ok');
