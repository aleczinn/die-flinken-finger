import { cache } from 'react';
import { getStoryblokApi } from '@/lib/storyblok';
import { DEFAULT_LOCALE, Locale } from '@/lib/locale/locales';
import { draftMode } from 'next/headers';

export interface Config {
    site_name: string;
    site_description: string;
    company: ConfigCompany;
}

interface ConfigCompany {
    managing_director: string;
    telephone: string;
    email: string;
    street: string;
    house_number: string;
    postal_code: string;
    town: string;
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
        site_name: content.site_name || process.env.NEXT_PUBLIC_SITE_NAME || 'Website',
        site_description: content.site_description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
        company: content.company[0]
    };
});