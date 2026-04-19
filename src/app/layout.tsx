import './globals.css';
import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import StoryblokProvider from '../components/StoryblokProvider';
import { BASE_URL } from '@/lib/site';

interface RootLayoutProps {
	children: ReactNode;
}

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
};

export const viewport: Viewport = {
	themeColor: '#171717',
	viewportFit: 'cover',
};

// Root-Layout ist absichtlich minimal: <html> und <body> kommen aus [lang]/layout.tsx
// damit das lang-Attribut aus der URL kommt (statisch, kein headers()-Aufruf nötig).
export default function RootLayout({ children }: RootLayoutProps) {
	return <StoryblokProvider>{children}</StoryblokProvider>;
}