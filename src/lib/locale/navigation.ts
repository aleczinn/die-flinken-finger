import 'server-only';
import { storyblokEditable } from '@storyblok/react/rsc';
import { NavigationItem, NavigationLink } from '@/lib/storyblok-queries';
import { resolveStoryblokLink } from '@/lib/locale/links';

export type ResolvedNavigationLink = {
    uid?: string;
    label: string;
    href: string | null;
    editable: Record<string, string>;
};

export type ResolvedNavigationItem = ResolvedNavigationLink & {
    description?: string;
    children: ResolvedNavigationLink[];
};

export async function resolveNavigationLink(item: NavigationLink, lang: string): Promise<ResolvedNavigationLink> {
    return {
        uid: item._uid,
        label: item.label,
        href: await resolveStoryblokLink(item.link, lang),
        editable: storyblokEditable(item) as Record<string, string>,
    };
}

export async function resolveNavigationItem(item: NavigationItem, lang: string): Promise<ResolvedNavigationItem> {
    const [href, children] = await Promise.all([
        resolveStoryblokLink(item.link, lang),
        Promise.all(
            (item.children ?? []).map((child) => resolveNavigationLink(child, lang)),
        ),
    ]);

    return {
        uid: item._uid,
        label: item.label,
        description: item.description,
        href,
        editable: storyblokEditable(item) as Record<string, string>,
        children,
    };
}