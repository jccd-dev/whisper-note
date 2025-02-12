import React from 'react';
import { Vortex } from '@/components/ui/vortex';
import { ButtonWithIcon } from './button-icon';
import { Button } from '@/components/ui/button';
import { MessageSquareHeart } from 'lucide-react';

export default function VortexDemoSecond() {
    return (
        <div className="w-full mx-auto rounded-md h-screen overflow-hidden">
            <Vortex
                backgroundColor="black"
                rangeY={800}
                particleCount={500}
                baseHue={170}
                className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
            >
                <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                    Whisper Note
                </h1>
                <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
                    Meaningful notes for friends, family, or someone special,
                    because everyone deserves a kind word.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <ButtonWithIcon />
                    <Button variant="outline">
                        <MessageSquareHeart className="text-red-500" /> Send to
                        someone
                    </Button>
                </div>
            </Vortex>
        </div>
    );
}
