import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import StoryblokProvider from '../components/StoryblokProvider';
import { BASE_URL } from '@/lib/site';

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
};

interface RootLayoutProps {
	children: ReactNode;
}

// Root-Layout ist absichtlich minimal: <html> und <body> kommen aus [lang]/layout.tsx
// damit das lang-Attribut aus der URL kommt (statisch, kein headers()-Aufruf nötig).
export default function RootLayout({ children }: RootLayoutProps) {
	return <StoryblokProvider>{children}</StoryblokProvider>;
}