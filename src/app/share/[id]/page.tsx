import { getTemporaryMessage } from '@/app/actions';
import { notFound } from 'next/navigation';
import ShareContent from './share-content';

export default async function SharePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const messageData = await getTemporaryMessage(id);

    if (!messageData) {
        notFound();
    }

    return <ShareContent id={id} initialData={messageData} />;
}
