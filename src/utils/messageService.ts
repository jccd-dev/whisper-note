'use server';

import { generateMessage } from './openai';
import db from './firebaseConfig';
import {
    collection,
    updateDoc,
    getDocs,
    where,
    query,
} from 'firebase/firestore';

export const fetchOrCreateMessage = async (name: string) => {
    const docRef = collection(db, 'selected_persons');
    const myQuery = query(
        docRef,
        where('nickname_Name', 'array-contains', name)
    );
    const docSnapshot = await getDocs(myQuery);

    if (!docSnapshot.empty) {
        const ref = docSnapshot.docs[0].ref;
        const data = docSnapshot.docs[0].data();

        if (data.aiGenerated) {
            return {
                aiMessage: data.aiGenerated,
            };
        }

        // If the message is not generated, generate it
        const aiMessage = await generateMessage(data.prompt_for_this_person);
        await updateDoc(ref, { aiGenerated: aiMessage });
        return { aiMessage };
    }

    // if no data is found, return an empty object
    return await generateRandomMessage(name);
};

const generateRandomMessage = async (name: string) => {
    const tones = ['sweet', 'warm', 'casual', 'inspirational'];
    const randomTone = tones[Math.floor(Math.random() * tones.length)];
    const prompt = `Write a ${randomTone} Valentine's message for ${name}. Make it unique, heartfelt, and meaningful. Keep the focus entirely on them—avoid mentioning the sender. Ensure the message feels personal and uplifting, staying within 200 tokens.`;

    const aiMessage = await generateMessage(prompt, 0.9);

    return { aiMessage };
};
