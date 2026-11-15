import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const messages = sqliteTable('messages', {
 id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull(), subject: text('subject').notNull(), message: text('message').notNull(), createdAt: integer('created_at').notNull(),
});
