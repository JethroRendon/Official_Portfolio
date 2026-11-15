import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getDb } from '../db/index.ts';

const names = ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_D1_DATABASE_ID', 'CLOUDFLARE_API_TOKEN'];
const initial = Object.fromEntries(names.map(key => [key, process.env[key]]));
const originalFetch = globalThis.fetch;
afterEach(() => {
 globalThis.fetch = originalFetch;
 for (const key of names) {
  if (initial[key] === undefined) delete process.env[key];
  else process.env[key] = initial[key];
 }
});
function configure() {
 process.env.CLOUDFLARE_ACCOUNT_ID = 'test-account';
 process.env.CLOUDFLARE_D1_DATABASE_ID = 'test-database';
 process.env.CLOUDFLARE_API_TOKEN = 'test-only-token';
}

test('missing inbox configuration does not silently accept a message', () => {
 for (const key of names) delete process.env[key];
 assert.throws(() => getDb(), /not configured/);
});

test('Vercel-compatible HTTPS adapter keeps user values in bound SQL parameters', async () => {
 configure();
 const calls = [];
 globalThis.fetch = async (url, options) => {
  calls.push({ url, ...options, payload: JSON.parse(options.body) });
  return Response.json({ success: true, result: [{ success: true, results: [] }] });
 };
 const db = getDb();
 const email = "o'neil@example.com";
 assert.deepEqual(await db.recentMessages(email, 123), []);
 await db.saveMessage({ id: 'test-id', name: "O'Neil", email, subject: 'Hello', message: 'A test message.', createdAt: 456 });
 assert.equal(calls.length, 2);
 assert.equal(calls[0].url, 'https://api.cloudflare.com/client/v4/accounts/test-account/d1/database/test-database/query');
 assert.equal(calls[0].headers.Authorization, 'Bearer test-only-token');
 assert.equal(calls[0].cache, 'no-store');
 assert.deepEqual(calls[0].payload.params, [email, 123]);
 assert.ok(!calls[0].payload.sql.includes(email));
 assert.deepEqual(calls[1].payload.params, ['test-id', "O'Neil", email, 'Hello', 'A test message.', 456]);
});

test('upstream HTTP failures do not report a saved message', async () => {
 configure();
 globalThis.fetch = async () => new Response('Unavailable', { status: 503 });
 await assert.rejects(getDb().recentMessages('test@example.com', 0), /request failed/);
});

test('query-level failures are rejected even when HTTP status is 200', async () => {
 configure();
 globalThis.fetch = async () => Response.json({ success: true, result: [{ success: false }] });
 await assert.rejects(getDb().recentMessages('test@example.com', 0), /query failed/);
});
