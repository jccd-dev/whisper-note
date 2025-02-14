import { useEffect, useState } from 'react';
import {
    collection,
    getDocs,
    query,
    where,
    updateDoc,
} from 'firebase/firestore';
import db from '@/utils/firebaseConfig';
import { generateMessage } from '@/utils/openai';

interface UseFetchMessageProps {
    customPrompt: string | null;
    aiMessage: string | null;
    loading: boolean;
}

export const useFetchMessage = (name: string): UseFetchMessageProps => {
    const [customPrompt, setCustomPrompt] = useState<string | null>(null);
    const [aiMessage, setAiMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchMessage = async () => {
            setLoading(true);

            try {
                const docRef = collection(db, 'selected_persons');
                const myQuery = query(
                    docRef,
                    where('nickname_Name', 'array-contains', name)
                );
                const docSnapshot = await getDocs(myQuery);

                if (!docSnapshot.empty) {
                    const ref = docSnapshot.docs[0].ref;
                    const data = docSnapshot.docs[0].data();
                    setCustomPrompt(data.prompt_for_this_person);

                    if (!data.aiGenerated) {
                        const aiMessage = await generateMessage(
                            data.prompt_for_this_person
                        );

                        setAiMessage(aiMessage);

                        //update the database with the generated message on current docs
                        await updateDoc(ref, {
                            aiGenerated: aiMessage,
                        });
                    } else {
                        setAiMessage(data.aiGenerated ?? '');
                    }
                } else {
                    fetchByName();
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchByName = async () => {
            const tones = [
                'sweet',
                'funny',
                'poetic',
                'casual',
                'warm',
                'playful',
                'inspirational',
            ];
            const randomTone = tones[Math.floor(Math.random() * tones.length)];

            const prompt = `Write a ${randomTone} Valentine’s message that spreads joy and positivity. Make it unique and uplifting. Keep it around 150 tokens`;

            setCustomPrompt(prompt);

            try {
                const aiMessage = await generateMessage(prompt);
                setAiMessage(aiMessage);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMessage();
    }, [name]);

    return { customPrompt, aiMessage, loading };
};
