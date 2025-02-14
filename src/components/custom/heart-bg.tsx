'use client';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const HeartSVG = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 47.5 47.5"
        id="heart"
    >
        <defs>
            <clipPath id="a">
                <path d="M0 38h38V0H0v38Z"></path>
            </clipPath>
        </defs>
        <g transform="matrix(1.25 0 0 -1.25 0 47.5)">
            <path
                fill="#dd2e44"
                d="M3.067 25.68c0 8.799 12.184 12.06 15.933 1.874 3.749 10.186 15.933 6.925 15.933-1.874C34.933 16.12 19 3.999 19 3.999S3.067 16.12 3.067 25.68"
            ></path>
        </g>
    </svg>
);

interface HeartProps {
    id: number;
    size: number;
    left: number;
    duration: number;
    delay: number;
}

export default function HeartsBackground() {
    const [hearts, setHearts] = useState<HeartProps[]>([]);

    useEffect(() => {
        const addHeart = () => {
            setHearts((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    size: Math.random() * 40 + 10, // 10px - 50px
                    left: Math.random() * 100, // Random X position
                    duration: Math.random() * 5 + 3, // 3s - 8s
                    delay: 0,
                },
            ]);

            // Remove old hearts to prevent memory overflow
            setTimeout(() => {
                setHearts((prev) => prev.slice(1));
            }, 8000);
        };

        const interval = setInterval(addHeart, 500); // Spawn a heart every 0.5s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden z-10">
            {hearts.map(({ id, size, left, duration }) => (
                <motion.div
                    key={id}
                    initial={{ y: '100vh', opacity: 0, scale: 0.5 }}
                    animate={{ y: '-90vh', opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration,
                        ease: 'easeOut',
                    }}
                    style={{
                        position: 'absolute',
                        left: `${left}%`,
                        bottom: 0,
                    }}
                >
                    <HeartSVG size={size} />
                </motion.div>
            ))}
        </div>
    );
}
