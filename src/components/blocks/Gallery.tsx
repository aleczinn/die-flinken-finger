import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';
import { Locale } from "@/lib/locale/locales";
import { useId } from "react";
import { Tagline } from "@/components/ui/Tagline";
import { Headline } from "@/components/ui/Headline";
import { StoryblokAsset } from "@/components/storyblok/types";
import { StoryblokLink } from "@/lib/storyblok-queries";
import { Text } from "@/components/ui/Text";
import { UILink } from "@/components/ui/UILink";
import { css } from "@/lib/utils";
import { resolveStoryblokLink } from "@/lib/locale/links";
import { StoryblokImage } from "@/components/storyblok/StoryblokImage";

type GalleryLayout = 'left' | 'center' | 'right';
type GalleryItemSize = 'default' | 'wide' | 'tall' | 'large';

interface GalleryProps {
    locale: Locale;
    blok: SbBlokData & {
        layout: GalleryLayout;
        tagline?: string;
        headline: string;
        description?: string;
        items: GalleryItemProps[];
    };
}

interface GalleryItemProps extends SbBlokData {
    image: StoryblokAsset;
    tag?: string;
    title: string;
    link?: StoryblokLink;
    size: GalleryItemSize;
}

const sizeClasses: Record<GalleryItemSize, string> = {
    default: 'md:col-span-1 md:row-span-1',
    wide:    'md:col-span-2 md:row-span-1',
    tall:    'md:col-span-1 md:row-span-2',
    large:   'md:col-span-2 md:row-span-2',
};

// width = Layoutbreite, sizes = Browser-Hint für srcset-Auswahl
const sizeImageWidths: Record<GalleryItemSize, number> = {
    default: 480,
    wide:    960,
    tall:    480,
    large:   960,
};

const sizeImageSizes: Record<GalleryItemSize, string> = {
    default: '(min-width: 1024px) 23vw, (min-width: 768px) 47vw, 100vw',
    wide:    '(min-width: 1024px) 47vw, 100vw',
    tall:    '(min-width: 1024px) 23vw, (min-width: 768px) 47vw, 100vw',
    large:   '(min-width: 1024px) 47vw, 100vw',
};

export default function Gallery({ locale, blok }: GalleryProps) {
    const headingId = useId();

    return (
        <Section variant="capped"
                 outerClassName="py-section"
                 innerClassName="flex flex-col"
                 aria-labelledby={blok.headline ? headingId : undefined}
                 {...storyblokEditable(blok)}
        >
            {blok.tagline && (
                <Tagline alignment={blok.layout} children={blok.tagline} className="mb-2" />
            )}

            {blok.headline && (
                <Headline id={headingId} as="h2" variant="h3" alignment={blok.layout} design="line" className="mb-4">
                    {blok.headline}
                </Headline>
            )}

            {blok.description && (
                <Text className="text-gray-70 leading-relaxed max-w-prose mb-4" alignment={blok.layout}>
                    {blok.description}
                </Text>
            )}

            <ul className={css(
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
                'auto-rows-[14rem] md:auto-rows-[16rem] lg:auto-rows-[14rem]',
                'gap-4 mt-4',
            )}>
                {blok.items?.map((item) => (
                    <GalleryItem key={item._uid} locale={locale} item={item} />
                ))}
            </ul>
        </Section>
    );
};

async function GalleryItem({ locale, item }: { locale: Locale; item: GalleryItemProps }) {
    const href = await resolveStoryblokLink(item.link ?? null, locale.language);
    const size = item.size ?? 'default';

    const inner = (
        <>
            {item.image?.filename && (
                <StoryblokImage asset={item.image}
                                width={sizeImageWidths[size]}
                                sizes={sizeImageSizes[size]}
                                background
                                className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
            )}

            {/* Lesbarkeits-Overlay – decorative */}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent"
                 aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col h-full p-6">
                {item.tag && (
                    <span className="self-start uppercase text-xs font-bold tracking-wider bg-primary text-white px-3 py-1 rounded-md">
                        {item.tag}
                    </span>
                )}

                <h3 className="mt-auto text-white font-semibold text-fluid-h5 text-pretty">
                    {item.title}
                </h3>
            </div>
        </>
    );

    const baseClasses = css(
        'group relative overflow-hidden rounded-2xl bg-gray-30',
        'min-h-56', // Mobile-Höhe, sonst kollabiert leeres Element
        sizeClasses[size],
    );

    if (href) {
        return (
            <li {...storyblokEditable(item)} className={sizeClasses[size]}>
                <UILink href={href}
                      className={css(
                          'block w-full h-full relative overflow-hidden rounded-2xl bg-gray-30',
                          'min-h-56',
                          'transition-shadow duration-200 hover:shadow-2xl shadow-black/20',
                          'focus-element',
                      )}
                      aria-label={item.tag ? `${item.title} – ${item.tag}` : item.title}
                >
                    {inner}
                </UILink>
            </li>
        );
    }

    return (
        <li {...storyblokEditable(item)} className={baseClasses}>
            {inner}
        </li>
    );
}