import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Shadows_Into_Light } from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const shadowsIntoLight = Shadows_Into_Light({
    variable: '--font-shadows-into-light',
    subsets: ['latin'],
    weight: '400',
});

export const metadata: Metadata = {
    title: {
        absolute: 'Whisper Note',
        default: '%s | Whisper Note',
    },
    description:
        'App for sending secret messages developed by John Carlo Digay (jccd-dev)',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.className} ${shadowsIntoLight.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
