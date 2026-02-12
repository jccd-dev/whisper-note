import { useEffect, useState } from 'react';
import { getMessage } from '@/app/actions';

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
                const result = await getMessage(name);
                setAiMessage(result.aiMessage);
                setCustomPrompt(result.customPrompt || null);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (name) {
            fetchMessage();
        }
    }, [name]);

    return { customPrompt, aiMessage, loading };
};
