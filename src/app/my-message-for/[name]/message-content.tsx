import Image from 'next/image';
import writtingImage from '../../../../public/images/writting.gif';
// Removed unused import for cuteImage
import { TextGenerateEffect } from '@/components/ui/text-generated-effect';
import { getMessage } from '@/app/actions';

export default async function MessageContent({ name }: { name: string }) {
    const cleanName = name.replace(/-/g, ' ');

    const { aiMessage } = await getMessage(cleanName);

    return (
        <>
            <div className="w-44 sm:w-56 lg:w-60 border-8 border-pink-600 rounded-md overflow-hidden mb-6">
                <div className="w-full rounded-md overflow-hidden">
                    <Image
                        src={writtingImage}
                        alt="Cute Image"
                        className="w-full"
                    />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-pink-600 mb-2">
                Hello {cleanName}
            </h1>
            {aiMessage ? (
                <div className="text-justify max-w-xl px-8 ">
                    <TextGenerateEffect
                        words={aiMessage}
                        filter={false}
                        className="text-xl text-semibold"
                    />
                </div>
            ) : (
                <h2 className="text-2xl font-bold text-pink-600 mb-2">
                    Im sorry, I could not find a message for you.
                </h2>
            )}
        </>
    );
}
