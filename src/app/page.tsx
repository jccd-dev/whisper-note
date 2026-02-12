'use client';
import React from 'react';
import { Vortex } from '@/components/ui/vortex';
import { Button } from '@/components/ui/button';
import { MessageSquareHeart } from 'lucide-react';

export default function VortexDemoSecond() {
    return (
        <div className="w-full mx-auto rounded-md h-screen overflow-hidden relative">
            {/* Shared Background Component */}
            <div className="absolute inset-0 z-0">
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
            </div>

            <Vortex
                backgroundColor="transparent"
                rangeY={800}
                particleCount={500}
                baseHue={340} // Pink/Red hue
                className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full relative z-10"
            >
                <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-rose-600 to-rose-900 drop-shadow-sm font-shadows-into-light">
                    Whisper Note
                </h1>
                <p className="text-rose-800 text-lg md:text-2xl max-w-xl mt-6 text-center font-medium">
                    Write it, Send it, Make someone smile because the sweetest
                    words are meant to be shared.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <a href="/create">
                        <Button
                            variant="default"
                            className="bg-rose-600 hover:bg-rose-700 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <MessageSquareHeart className="mr-2 h-5 w-5" /> Send
                            to someone
                        </Button>
                    </a>
                </div>
            </Vortex>
        </div>
    );
}
