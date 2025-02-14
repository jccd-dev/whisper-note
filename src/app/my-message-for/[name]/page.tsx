import HeartsBackground from '@/components/custom/heart-bg';
import LoadingMessage from '@/components/custom/loadingMessage';
import { Suspense } from 'react';
import MessageContent from './message-content';

interface MyMessageProps {
    params: { name: string };
}

export default async function MyMessage({ params }: MyMessageProps) {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
            <HeartsBackground />
            <Suspense fallback={<LoadingMessage />}>
                <MessageContent name={params.name} />
            </Suspense>
        </main>
    );
}
