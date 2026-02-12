'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { checkNameExists } from '@/app/actions';
import Image from 'next/image';
import cuteHello from '../../../public/images/CatHello.gif';

export default function GetMessage() {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name) {
            try {
                // Verify DB connection/name existence (optional but keeps original flow)
                await checkNameExists(name);

                const formattedName = name
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join('-')
                    .trim();

                setError('');
                router.push(`/my-message-for/${formattedName}`);
            } catch (error) {
                console.error(error);
                setError('An error occurred. Please try again later.');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //each first letter of every word of the name should be capitalized
        const name = e.target.value
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim();

        setName(name);
    };

    // placeholders
    const placeholders = [
        'Your Name or Nickname',
        'Name that others Know You',
        'How Others Called You',
        'How You Want to be Called',
    ];

    return (
        <>
            <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
                <div className="w-60 border-8 border-pink-600 rounded-md overflow-hidden mb-6">
                    <div className="w-full rounded-md overflow-hidden">
                        <Image
                            src={cuteHello}
                            alt="Cute Image"
                            className="w-full"
                        />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-pink-600 mb-2">
                    Whisper Note
                </h1>
                <p className="text-gray-500 mb-6 mx-8 text-center">
                    Enter your name or nickname to get your whisper note.
                </p>
                <div className="">
                    <PlaceholdersAndVanishInput
                        placeholders={placeholders}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    />
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
            </main>
        </>
    );
}
