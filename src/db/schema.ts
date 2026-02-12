import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const selectedPersons = pgTable('selected_persons', {
    id: serial('id').primaryKey(),
    nicknameName: text('nickname_name').array().notNull(), // Array of strings
    promptForThisPerson: text('prompt_for_this_person').notNull(),
    aiGenerated: text('ai_generated'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const temporaryMessages = pgTable('temporary_messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    senderName: text('sender_name').notNull(),
    recipientName: text('recipient_name').notNull(),
    salutation: text('salutation').notNull().default('For [Name]'),
    message: text('message').notNull(),
    closing: text('closing').notNull().default('With love,'),
    passphrase: text('passphrase'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow(),
});
