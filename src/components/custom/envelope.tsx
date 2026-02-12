'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EnvelopeProps {
    senderName: string;
    onOpen: () => void;
}

export default function Envelope({ senderName, onOpen }: EnvelopeProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => {
                onOpen();
            }, 1500); // Wait for animation before triggering parent
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 cursor-pointer" onClick={handleOpen}>
            <div className="relative w-72 h-48 bg-pink-200 shadow-xl rounded-b-lg overflow-visible">
                {/* Envelope Body */}
                <div className="absolute inset-0 z-10 border-l-[144px] border-r-[144px] border-b-[96px] border-l-transparent border-r-transparent border-b-pink-300 rounded-b-lg pointer-events-none" />
                
                {/* Letter */}
                <motion.div
                    initial={{ y: 0 }}
                    animate={isOpen ? { y: -100 } : { y: 0 }}
                    transition={{ delay: 0.5, duration: 1, type: 'spring' }}
                    className="absolute left-4 right-4 top-2 h-40 bg-white shadow-md p-4 flex flex-col items-center justify-center rounded-sm z-0"
                >
                    <p className="text-pink-500 font-serif text-sm">A message from</p>
                    <p className="text-gray-800 font-bold font-script text-xl mt-1">{senderName}</p>
                </motion.div>

                {/* Flap */}
                <motion.div
                    initial={{ rotateX: 0 }}
                    animate={isOpen ? { rotateX: 180, zIndex: 0 } : { rotateX: 0, zIndex: 20 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformOrigin: 'top' }}
                    className="absolute top-0 left-0 w-full h-0 border-l-[144px] border-r-[144px] border-t-[96px] border-l-transparent border-r-transparent border-t-pink-400 rounded-t-lg shadow-sm"
                />
            </div>
            
            <motion.div 
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="mt-12 text-pink-400 font-medium tracking-widest uppercase text-sm"
            >
                Tap to open
            </motion.div>
        </div>
    );
}
