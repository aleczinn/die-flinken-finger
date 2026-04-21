'use client';
import { ReactNode } from 'react';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

// Minimaler Client-Init: nur Bridge fürs Live-Editing. Keine Component-Map,
// damit keine Server-Komponenten versehentlich in den Client-Bundle gezogen werden.
storyblokInit({
	accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
	use: [apiPlugin],
	apiOptions: {
		region: process.env.STORYBLOK_REGION || 'eu',
	},
});

interface StoryblokProviderProps {
	children: ReactNode;
}

export default function StoryblokProvider({ children }: StoryblokProviderProps) {
	return children;
}