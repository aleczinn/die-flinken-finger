import { cache } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';
import { DEFAULT_LOCALE, Locale } from '@/lib/locale/locales';
import { draftMode } from 'next/headers';
import { SbBlokData } from "@storyblok/react";

type Weekday = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa' | 'So';

export type StoryblokLink = | {
    linktype: 'story';
    id?: string;
    url?: string;
    cached_url?: string;
    anchor?: string;
    target?: '_self' | '_blank';
} | {
    linktype: 'url';
    url: string;
    cached_url?: string;
    anchor?: string;
    target?: '_self' | '_blank';
} | {
    linktype: 'email';
    email: string;
    target?: '_self' | '_blank';
} | {
    linktype: 'asset';
    url: string;
    target?: '_self' | '_blank';
};

export interface Config {
    site_name: string;
    site_description: string;
    owner: string;
    telephone: string;
    email: string;
    address_street_house_number: string;
    address_plz_town: string;
    opening_hours?: OpeningHoursItem[];
    header_navigation: NavigationItem[];
    footer_navigation: NavigationLink[];
}

export interface OpeningHoursItem {
    _uid: string;
    days: Weekday[];
    closed: boolean;
    open?: string;
    close?: string;
    note?: string;
}

export interface NavigationItem extends SbBlokData {
    label: string;
    description?: string;
    link?: StoryblokLink;
    children?: NavigationLink[];
}

export interface NavigationLink extends SbBlokData {
    label: string;
    link: StoryblokLink;
}

export async function getVersion(): Promise<'draft' | 'published'> {
    if (process.env.NODE_ENV === 'development') {
        return 'draft';
    }

    try {
        const draft = await draftMode();
        return draft.isEnabled ? 'draft' : 'published';
    } catch {
        return 'published';
    }
}

/**
 * Lädt eine Storyblok Story anhand des Slugs.
 *
 * Wrapped mit React `cache()`, da `storyblokApi.get()` kein nativer `fetch()` ist
 * und daher nicht von Next.js' automatischer Request Memoization profitiert.
 * `cache()` stellt sicher, dass bei identischen Argumenten innerhalb eines
 * Server-Renders nur ein einziger Netzwerk-Request ausgeführt wird –
 * auch wenn `generateMetadata` und `Page` die Funktion beide aufrufen.
 *
 * @see https://react.dev/reference/react/cache
 */
export const getStory = cache(async (locale: Locale = DEFAULT_LOCALE, slug: string) => {
    const storyblokApi = getStoryblokApi();
    const version = await getVersion();

    try {
        return await storyblokApi.get(`cdn/stories/${slug}`, {
            version,
            language: locale.storyblokCode,
        });
    } catch (error: any) {
        // Storyblok wirft bei 404 einen Fehler mit status 404
        if (error?.status === 404 || error?.response?.status === 404) {
            return null;
        }
        // Echte Fehler weiterwerfen -> Next.js zeigt error.tsx
        throw error;
    }
});

/**
 * Lädt alle Storyblok Links in einem einzigen Request.
 * `cache()` dedupliziert den Call innerhalb eines Server-Renders
 * (z.B. wenn mehrere Komponenten gleichzeitig rendern).
 * ISR-Revalidierung übernimmt `cachedFetch` in storyblok.ts (60s in prod).
 */
export const getLinks = cache(async (locale?: Locale) => {
    const storyblokApi = getStoryblokApi();
    const version = await getVersion();

    return storyblokApi.get('cdn/links', {
        version,
        ...(locale && { language: locale.storyblokCode }),
    });
});

/**
 * Lädt die globale Konfiguration aus Storyblok, welche z. B. Inhalte wie Announcement-Bars beinhaltet.
 */
export const getConfig = cache(async (locale: Locale): Promise<Config> => {
    const storyblokApi = getStoryblokApi();
    const version = await getVersion();

    const { data } = await storyblokApi.get('cdn/stories/config', {
        version,
        language: locale.storyblokCode,
    });

    const content = data.story.content;

    return {
        ...content,
        site_name: content.site_name || process.env.NEXT_PUBLIC_SITE_NAME || 'Website',
        site_description: content.site_description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
        opening_hours: content.opening_hours ?? []
    };
});