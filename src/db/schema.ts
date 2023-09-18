import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 20 }).unique().notNull(),
  about: text('about').default('').notNull(),
  passwordHash: text('password_hash').notNull(),
  registeredAt: timestamp('registered_at').defaultNow().notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  posts: many(posts)
}));

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  lastActivity: timestamp('last_activity').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').unique().notNull(),
  content: text('content').notNull(),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  authorId: integer('author_id').references(() => users.id, {
    onDelete: 'set null'
  })
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  })
}));
