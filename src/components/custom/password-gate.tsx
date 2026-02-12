'use client';

import React, { useState } from 'react';
import { verifyTemporaryMessage } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';

interface PasswordGateProps {
    id: string;
    onUnlock: (message: string) => void;
}

export default function PasswordGate({ id, onUnlock }: PasswordGateProps) {
    const [passphrase, setPassphrase] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);

        try {
            const result = await verifyTemporaryMessage(id, passphrase);
            if (result.success && result.message) {
                onUnlock(result.message);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-pink-100 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="h-16 w-16 bg-pink-100 rounded-full flex items-center justify-center">
                        <Lock className="h-8 w-8 text-pink-600" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Protected Message
                </h1>
                <p className="text-gray-500 mb-6">
                    This valentine message is password protected.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password" // Use password type to mask input
                            placeholder="Enter Passphrase"
                            className={`w-full px-4 py-2 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition`}
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                        />
                        {error && <p className="text-red-500 text-sm mt-1 text-left">Incorrect passphrase</p>}
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full bg-pink-500 hover:bg-pink-600"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <>Unlock Message <ArrowRight className="ml-2 h-4 w-4" /></>}
                    </Button>
                </form>
            </div>
        </div>
    );
}
