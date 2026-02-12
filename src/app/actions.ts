'use server';

import { db } from '@/db';
import { selectedPersons, temporaryMessages } from '@/db/schema';
import { arrayContains, eq } from 'drizzle-orm';
import { generateMessage } from '@/utils/openai';
import profanityList from '@/data/profanity.json';
import { Profanity } from '@2toad/profanity';

const profanitySource = profanityList as { words: string[] };
const profanity = new Profanity({ languages: ['en'] });
profanity.addWords(profanitySource.words);

const containsProfanity = (text: string) => profanity.exists(text);

export async function createTemporaryMessage(data: {
    senderName: string;
    recipientName: string;
    salutation: string;
    message: string;
    closing: string;
    passphrase?: string;
}) {
    if (containsProfanity(data.message)) {
        throw new Error('Message contains prohibited words.');
    }
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const [inserted] = await db
        .insert(temporaryMessages)
        .values({
            senderName: data.senderName,
            recipientName: data.recipientName,
            salutation: data.salutation,
            message: data.message,
            closing: data.closing,
            passphrase: data.passphrase || null,
            expiresAt,
        })
        .returning({ id: temporaryMessages.id });

    return inserted.id;
}

export async function getTemporaryMessage(id: string) {
    try {
        const results = await db
            .select()
            .from(temporaryMessages)
            .where(eq(temporaryMessages.id, id));

        if (results.length > 0) {
            const msg = results[0];
            if (msg.expiresAt && msg.expiresAt.getTime() <= Date.now()) {
                await db
                    .delete(temporaryMessages)
                    .where(eq(temporaryMessages.id, id));
                return null;
            }
            if (msg.passphrase) {
                return {
                    ...msg,
                    message: '', // Hide message
                    isLocked: true,
                };
            }
            return { ...msg, isLocked: false };
        }
        return null;
    } catch (error) {
        console.error('Error in getTemporaryMessage:', error);
        return null;
    }
}

export async function verifyTemporaryMessage(id: string, passphrase: string) {
    try {
        const results = await db
            .select()
            .from(temporaryMessages)
            .where(eq(temporaryMessages.id, id));

        if (results.length > 0) {
            const msg = results[0];
            if (msg.expiresAt && msg.expiresAt.getTime() <= Date.now()) {
                await db
                    .delete(temporaryMessages)
                    .where(eq(temporaryMessages.id, id));
                return { success: false, message: null };
            }
            if (msg.passphrase === passphrase) {
                return { success: true, message: msg.message };
            }
        }
        return { success: false, message: null };
    } catch (error) {
        console.error('Error in verifyTemporaryMessage:', error);
        return { success: false, message: null };
    }
}

export async function getMessage(name: string) {
    try {
        // Query DB
        const results = await db
            .select()
            .from(selectedPersons)
            .where(arrayContains(selectedPersons.nicknameName, [name]));

        if (results.length > 0) {
            const person = results[0];

            if (person.aiGenerated) {
                return {
                    aiMessage: person.aiGenerated,
                    customPrompt: person.promptForThisPerson,
                };
            }

            // Generate
            const aiMessage = await generateMessage(person.promptForThisPerson);

            // Update DB
            await db
                .update(selectedPersons)
                .set({ aiGenerated: aiMessage })
                .where(eq(selectedPersons.id, person.id));

            return { aiMessage, customPrompt: person.promptForThisPerson };
        }

        // Not found - Generate Random
        return await generateRandomMessage(name);
    } catch (error) {
        console.error('Error in getMessage:', error);
        // Fallback to random message on error (e.g. DB connection fail)
        return await generateRandomMessage(name);
    }
}

async function generateRandomMessage(name: string) {
    const tones = [
        'sweet',
        'funny',
        'poetic',
        'casual',
        'warm',
        'playful',
        'inspirational',
        'gratitude',
    ];
    const themes = [
        'adventurous',
        'nostalgic',
        'quirky',
        'sincere',
        'motivational',
        'friendship',
    ];
    const emotions = [
        'joy',
        'gratitude',
        'admiration',
        'excitement',
        'happiness',
        'love',
    ];

    const randomTone = tones[Math.floor(Math.random() * tones.length)];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    const prompt = `Make a ${randomTone} for ${name}, ${randomTheme} message that expresses ${randomEmotion}. Keep it brief but complete, no more than 4 sentences. Add a bit of creativity!. Keep the focus entirely on them and avoid mentioning the sender`;

    const aiMessage = await generateMessage(prompt, 0.9);

    return { aiMessage, customPrompt: prompt };
}

export async function checkNameExists(name: string) {
    try {
        const results = await db
            .select()
            .from(selectedPersons)
            .where(arrayContains(selectedPersons.nicknameName, [name]));
        return results.length > 0;
    } catch (error) {
        console.error('Error checking name:', error);
        return false;
    }
}
