'use client';

import { useState, type FormEvent } from 'react';
import { createTemporaryMessage } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Copy, Check, Lock, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CreateMessage() {
    const [loading, setLoading] = useState(false);
    const [createdId, setCreatedId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const salutationOptions = [
        'My dearest',
        'My love',
        'Darling',
        'Beloved',
        'My one and only',
        'Sweetheart',
        'To my soulmate',
        'My darling',
    ];
    const closingOptions = [
        'With love,',
        'Forever yours,',
        'All my love,',
        'Yours always,',
        'Endlessly yours,',
        'Love always,',
        'With all my heart,',
        'XOXO,',
        'From,',
    ];
    const [formData, setFormData] = useState({
        senderName: '',
        recipientName: '',
        salutation: salutationOptions[0],
        message: '',
        closing: closingOptions[0],
        passphrase: '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const id = await createTemporaryMessage({
                senderName: formData.senderName,
                recipientName: formData.recipientName,
                salutation: formData.salutation,
                message: formData.message,
                closing: formData.closing,
                passphrase: formData.passphrase,
            });
            setCreatedId(id);
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const url = `${window.location.origin}/share/${createdId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (createdId) {
        return (
            <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-pink-100 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Valentine Created!
                    </h1>
                    <p className="text-gray-500 mb-6">
                        Your message is ready to be shared.
                    </p>

                    <div className="flex items-center gap-2 mb-6">
                        <input
                            readOnly
                            value={`${window.location.origin}/share/${createdId}`}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 outline-none"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={copyToClipboard}
                        >
                            {copied ? (
                                <Check className="h-4 w-4 text-green-600" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href={`/share/${createdId}`}>
                            <Button className="w-full bg-pink-500 hover:bg-pink-600">
                                View Message <Eye className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setCreatedId(null);
                                setFormData({
                                    senderName: '',
                                    recipientName: '',
                                    salutation: salutationOptions[0],
                                    message: '',
                                    closing: closingOptions[0],
                                    passphrase: '',
                                });
                            }}
                        >
                            Create Another
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-pink-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-pink-600 mb-2">
                        Send Some Love
                    </h1>
                    <p className="text-gray-500">
                        Create a valentine message for your special someone.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Who is this for?
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="Recipient's Name"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                            value={formData.recipientName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    recipientName: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Salutation
                        </label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                            value={formData.salutation}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    salutation: e.target.value,
                                })
                            }
                        >
                            {salutationOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Message
                        </label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Write something sweet..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition resize-none"
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    message: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            From
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="Your Name"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                            value={formData.senderName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    senderName: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Complimentary Close
                        </label>
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                            value={formData.closing}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    closing: e.target.value,
                                })
                            }
                        >
                            {closingOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <Lock className="h-3 w-3" /> Passphrase (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="Protect with a secret word..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                            value={formData.passphrase}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    passphrase: e.target.value,
                                })
                            }
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            If set, the recipient must enter this to view the
                            message.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        ) : (
                            <>
                                Create Valentine
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
