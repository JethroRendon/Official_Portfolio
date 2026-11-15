/** Server-only D1 access over HTTPS: works in Vercel's Node.js runtime. */
type Message = { id: string; name: string; email: string; subject: string; message: string; createdAt: number };
type QueryResult = { success?: boolean; results?: Record<string, unknown>[] };
type D1Response = { success?: boolean; result?: QueryResult[] };

export function getDb() {
 const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
 const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
 const token = process.env.CLOUDFLARE_API_TOKEN;
 if (!accountId || !databaseId || !token) throw new Error('Contact inbox environment variables are not configured.');
 const endpoint = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/d1/database/${encodeURIComponent(databaseId)}/query`;
 async function query(sql: string, params: (string | number)[]): Promise<Record<string, unknown>[]> {
  const response = await fetch(endpoint, {
   method: 'POST',
   headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
   body: JSON.stringify({ sql, params }),
   cache: 'no-store',
   signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error('Contact database request failed.');
  const data = await response.json() as D1Response;
  if (!data.success || !Array.isArray(data.result) || !data.result[0]?.success) throw new Error('Contact database query failed.');
  return data.result[0].results || [];
 }
 return {
  recentMessages(email: string, after: number) {
   return query('SELECT id FROM messages WHERE email = ? AND created_at >= ? LIMIT 1', [email, after]);
  },
  async saveMessage(message: Message) {
   await query('INSERT INTO messages (id, name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)', [message.id, message.name, message.email, message.subject, message.message, message.createdAt]);
  },
 };
}
