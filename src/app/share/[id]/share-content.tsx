'use client';

import { useMemo, useState, useEffect } from 'react';
import FlowerBouquet from '@/components/custom/flower-bouquet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Eye, EyeOff } from 'lucide-react';
import PasswordGate from '@/components/custom/password-gate';
import Envelope from '@/components/custom/envelope';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/use-auth-store';
import { TextGenerateEffect } from '@/components/ui/text-generated-effect';

interface ShareContentProps {
    id: string;
    initialData: {
        id: string;
        senderName: string;
        recipientName: string;
        salutation: string;
        message: string;
        closing: string;
        passphrase?: string | null;
        isLocked?: boolean;
    };
}

export default function ShareContent({ id, initialData }: ShareContentProps) {
    const { unlockShare } = useAuthStore();
    const unlockedMessage = useAuthStore((state) => state.unlockedMessages[id]);
    const resolvedMessage = useMemo(
        () => unlockedMessage ?? initialData.message,
        [initialData.message, unlockedMessage]
    );
    const resolvedLocked = useMemo(
        () => (unlockedMessage ? false : initialData.isLocked || false),
        [initialData.isLocked, unlockedMessage]
    );
    const salutationText = useMemo(() => {
        return initialData.salutation.replace(
            /\[Name\]|\{Name\}|\{name\}|\[name\]/g,
            initialData.recipientName
        );
    }, [initialData.recipientName, initialData.salutation]);

    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
    const [showCard, setShowCard] = useState(false);
    const [hasInitialLoadHappened, setHasInitialLoadHappened] = useState(false);

    // Handle the initial delayed appearance of the card
    useEffect(() => {
        if (isEnvelopeOpen && !hasInitialLoadHappened) {
            const timer = setTimeout(() => {
                setShowCard(true);
                setHasInitialLoadHappened(true);
            }, 3500); // 3.5s delay to let flowers bloom fully
            return () => clearTimeout(timer);
        }
    }, [isEnvelopeOpen, hasInitialLoadHappened]);

    const handleUnlock = (unlockedMessage: string) => {
        unlockShare(id, unlockedMessage);
    };

    // Shared Background Component to ensure consistency
    const Background = () => (
        <>
            {/* Base White Background */}
            <div className="absolute inset-0 z-0 bg-white" />

            {/* Mesh Gradient Layers */}
            {/* Top Left - Soft Rose/Red */}
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-rose-400/40 rounded-full blur-[100px] md:blur-[120px]" />

            {/* Top Right - Light Pink/White */}
            <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-pink-100/60 rounded-full blur-[100px] md:blur-[120px]" />

            {/* Bottom Right - Bright Magenta/Pink */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-pink-500/30 rounded-full blur-[100px] md:blur-[120px]" />

            {/* Bottom Left - Soft White/Light */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-pink-50/50 rounded-full blur-[100px] md:blur-[120px]" />

            {/* Center/Random - Extra pop of color */}
            <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-rose-300/20 rounded-full blur-[80px]" />

            {/* Noise Texture Overlay */}
            <div
                className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </>
    );

    if (resolvedLocked) {
        return <PasswordGate id={id} onUnlock={handleUnlock} />;
    }

    if (!isEnvelopeOpen) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                <Background />
                <div className="relative z-10">
                    <Envelope
                        senderName={initialData.senderName}
                        onOpen={() => setIsEnvelopeOpen(true)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <Background />

            {/* Navigation & Controls */}
            <div className="absolute top-4 left-4 z-30 flex gap-2">
                <Link href="/">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-md text-rose-700 hover:text-rose-900 border border-white/50 shadow-sm"
                    >
                        <Home className="h-5 w-5" />
                    </Button>
                </Link>
            </div>

            <div className="absolute top-4 right-4 z-30">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCard(!showCard)}
                    className="rounded-full bg-white/40 hover:bg-white/60 backdrop-blur-md text-rose-700 hover:text-rose-900 border border-white/50 shadow-sm"
                    title={showCard ? 'Hide Message' : 'Show Message'}
                >
                    {showCard ? (
                        <EyeOff className="h-5 w-5" />
                    ) : (
                        <Eye className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Background 3D Scene */}
            <div className="absolute inset-0 z-0">
                <FlowerBouquet />
            </div>

            {/* Content Overlay */}
            <AnimatePresence>
                {showCard && (
                    <motion.div
                        key="message-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="max-w-2xl w-full text-justify space-y-8 bg-white/40 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-pink-200/50 border border-white/60 relative overflow-hidden pointer-events-auto">
                            {/* Decorative shimmer/glow effect inside card */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-pink-300/30 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-300/30 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

                            {/* Recipient */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 1 }}
                                className="text-center md:text-left"
                            >
                                <span className="inline-block px-6 py-2 bg-white/50 backdrop-blur-md text-rose-800 text-xl md:text-2xl font-bold rounded-full shadow-sm border border-white/50 font-shadows-into-light tracking-wide">
                                    {salutationText}
                                </span>
                            </motion.div>

                            {/* Message with TextGenerateEffect */}
                            <div className="min-h-[200px] flex items-center justify-center">
                                <TextGenerateEffect
                                    words={resolvedMessage}
                                    className="font-shadows-into-light text-2xl md:text-4xl text-rose-900 leading-relaxed drop-shadow-sm whitespace-pre-wrap"
                                    duration={2} // Slower, more romantic pace
                                />
                            </div>

                            {/* Sender */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: 2.5, // Wait for text generation roughly
                                    duration: 1,
                                }}
                                className="text-right"
                            >
                                <p className="text-3xl text-rose-800 font-shadows-into-light mt-8 font-bold">
                                    {initialData.closing}
                                    <span className="block text-4xl mt-2 text-rose-900">
                                        {initialData.senderName}
                                    </span>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
