import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';
import { Locale } from "@/lib/locale/locales";
import { useId } from "react";
import { Tagline } from "@/components/ui/Tagline";
import { Headline } from "@/components/ui/Headline";
import { StoryblokAsset } from "@/components/storyblok/types";
import { StoryblokLink } from "@/lib/storyblok-queries";
import StoryblokRichTextRenderer from "@/components/storyblok/StoryblokRichTextRenderer";
import { Text } from "@/components/ui/Text";

type GalleryLayout = 'left' | 'center' | 'right';
type GalleryItemSize = 'default' | 'wide' | 'tall' | 'large';

interface GalleryProps {
    blok: SbBlokData & {
        layout: GalleryLayout;
        tagline?: string;
        headline: string;
        description?: string;
        items: GalleryItem[];
    };
}

interface GalleryItem {
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

export default function Gallery({ blok }: GalleryProps) {
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
                <Headline id={headingId} as="h2" variant="h3" alignment={blok.layout} design="line" className="mb-8">
                    {blok.headline}
                </Headline>
            )}

            {blok.description && (
                <Text className="text-gray-70 leading-relaxed max-w-prose" alignment={blok.layout}>
                    {blok.description}
                </Text>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4">

            </div>
        </Section>
    );
};