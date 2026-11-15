-- Apply once to your Cloudflare D1 database using its SQL console.
-- This matches the messages table used by the previous portfolio export.
CREATE TABLE IF NOT EXISTS messages (
 id TEXT PRIMARY KEY NOT NULL,
 name TEXT NOT NULL,
 email TEXT NOT NULL,
 subject TEXT NOT NULL,
 message TEXT NOT NULL,
 created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS messages_email_created_idx ON messages (email, created_at);
