import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section, { SectionBackground } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { Headline } from '@/components/ui/Headline';
import { StoryblokMedia } from '@/components/storyblok/StoryblokMedia';
import StoryblokRichTextRenderer from '@/components/storyblok/StoryblokRichTextRenderer';
import { resolveStoryblokLink } from "@/lib/locale/links";
import { Locale } from "@/lib/locale/locales";
import { useId } from "react";
import { Tagline } from "@/components/ui/Tagline";

type BeforeAfterLayout = 'left' | 'right';

interface BeforeAfterWithTextProps {
    locale: Locale;
    blok: SbBlokData & {
        layout: BeforeAfterLayout;
        tagline?: string;
        headline: string;
        text: any;
        before: any;
        after: any;
        primary_button_text?: string;
        primary_button_link?: any;
        secondary_button_text?: string;
        secondary_button_link?: any;
    };
    priority?: boolean;
    background?: SectionBackground;
}

export default async function BeforeAfterWithText({ blok, priority = false, locale, background }: BeforeAfterWithTextProps) {
    const headingId = useId();
    const isMediaLeft = blok.layout === 'left';
    const href = await resolveStoryblokLink(blok.primary_button_link, locale.language);
    const hrefSecondary = await resolveStoryblokLink(blok.secondary_button_link, locale.language);

    return (
        <Section variant="capped"
                 background={background}
                 outerClassName="py-section"
                 innerClassName="grid grid-cols-1 lg:grid-cols-2 gap-8"
                 aria-labelledby={blok.headline ? headingId : undefined}
                 {...storyblokEditable(blok)}
        >
            <div className={`flex flex-col justify-center ${isMediaLeft ? 'order-1' : 'order-2'}`}>
                {/*<StoryblokMedia asset={blok.media}*/}
                {/*                width={720}*/}
                {/*                priority={priority}*/}
                {/*                sizes="(min-width: 768px) 712px, calc(100vw - 32px)"*/}
                {/*                className="rounded-2xl"*/}
                {/*/>*/}
            </div>

            <div className={`flex flex-col justify-center ${isMediaLeft ? 'order-2' : 'order-1'}`}>
                {blok.tagline && (
                    <Tagline alignment="left" children={blok.tagline} className="mb-2" />
                )}

                {blok.headline && (
                    <Headline id={headingId} as="h2" variant="h3" alignment="left" design="line" className="mb-8">
                        {blok.headline}
                    </Headline>
                )}

                {blok.text && (
                    <StoryblokRichTextRenderer content={blok.text} className="text-gray-70 leading-relaxed" />
                )}

                {((blok.primary_button_text && href) || (blok.secondary_button_text && hrefSecondary)) && (
                    <div className="flex flex-row gap-8 mt-8">
                        {blok.primary_button_text && href && (
                            <Button variant="primary" href={href} className="font-bold">
                                {blok.primary_button_text}
                            </Button>
                        )}

                        {blok.secondary_button_text && hrefSecondary && (
                            <Button variant="primary" hollow href={hrefSecondary} className="">
                                {blok.secondary_button_text}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Section>
    );
};
