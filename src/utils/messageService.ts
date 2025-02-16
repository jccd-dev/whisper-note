'use server';

import { generateMessage } from './openai';

export const fetchOrCreateMessage = async (name: string) => {
    // const docRef = collection(db, 'selected_persons');
    // const myQuery = query(
    //     docRef,
    //     where('nickname_Name', 'array-contains', name)
    // );
    // const docSnapshot = await getDocs(myQuery);

    // if (!docSnapshot.empty) {
    //     const ref = docSnapshot.docs[0].ref;
    //     const data = docSnapshot.docs[0].data();

    //     if (data.aiGenerated) {
    //         return {
    //             aiMessage: data.aiGenerated,
    //         };
    //     }

    //     // If the message is not generated, generate it
    //     const aiMessage = await generateMessage(data.prompt_for_this_person);
    //     await updateDoc(ref, { aiGenerated: aiMessage });
    //     return { aiMessage };
    // }

    // if no data is found, return an empty object
    return await generateRandomMessage(name);
};

const generateRandomMessage = async (name: string) => {
    // Generate a truly unique prompt
    const tones = [
        'sweet',
        'funny',
        'poetic',
        'casual',
        'warm',
        'playful',
        'inspirational',
    ];
    const themes = [
        'adventurous',
        'nostalgic',
        'quirky',
        'sincere',
        'motivational',
    ];
    const emotions = [
        'joy',
        'gratitude',
        'admiration',
        'excitement',
        'happiness',
    ];

    const randomTone = tones[Math.floor(Math.random() * tones.length)];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    const prompt = `Make a ${randomTone} for ${name}, ${randomTheme} message that expresses ${randomEmotion}. Keep it brief but complete, no more than 4 sentences. Add a bit of creativity!. Keep the focus entirely on them and avoid mentioning the sender`;

    const aiMessage = await generateMessage(prompt, 0.9);

    return { aiMessage };
};
