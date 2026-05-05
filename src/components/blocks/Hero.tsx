import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';
import { StoryblokMedia } from "@/components/storyblok/StoryblokMedia";
import { Headline } from "@/components/ui/Headline";
import { Button } from "@/components/ui/Button";
import { parseHighlights } from "@/lib/text";
import { Locale } from "@/lib/locale/locales";
import { resolveStoryblokLink } from "@/lib/locale/links";
import { useId } from "react";

interface HeroProps {
    blok: SbBlokData & {
        background: any;
        headline: string;
        text?: string;
        button_text?: string;
        button_link?: any;
        secondary_button_text?: string;
        secondary_button_link?: any;
    };
    priority?: boolean;
    locale: Locale;
}

export default async function Hero({ blok, priority = false, locale }: HeroProps) {
    const headingId = useId();
    const href = await resolveStoryblokLink(blok.button_link, locale.language);
    const hrefSecondary = await resolveStoryblokLink(blok.secondary_button_link, locale.language);

    // min height sagt aus: hero muss mindestens 22rem hoch sein ansonsten 90svh - header höhe
    return (
        <Section variant="none"
                 className="relative w-full min-h-[max(22rem,calc(90lvh-9.125rem))] flex items-center overflow-hidden isolate"
                 aria-labelledby={blok.headline ? headingId : undefined}
                 {...storyblokEditable(blok)}
        >
            {/* Hintergrund-Medium: absolute, füllt die Section */}
            {blok.background && (
                <div className="absolute inset-0 -z-10">
                    <StoryblokMedia asset={blok.background}
                                    width={1920}
                                    height={1080}
                                    priority={priority}
                                    sizes="100vw"
                                    className="w-full h-full object-cover"
                                    background
                    />
                </div>
            )}

            {/* Overlay für Lesbarkeit */}
            <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true"/>

            {/* Content: capped, also bündig zur restlichen Seite */}
            <Section variant="capped" outerClassName="h-full" innerClassName="h-full">
                <div className="h-full max-w-none md:max-w-1/2 flex flex-col justify-center text-white py-section">
                    <Headline as="h1" id={headingId} variant="h1" className="text-gray-10 mb-8">
                        {parseHighlights(blok.headline).map((segment, i) => (
                            segment.highlight ? (
                                <span key={i} className="text-primary">{segment.text}</span>
                            ) : (
                                <span key={i}>{segment.text}</span>
                            )
                        ))}
                    </Headline>

                    {blok.text && (
                        <p className="font-display text-fluid-h6 font-normal text-gray-10 max-w-none md:max-w-[40ch]">
                            {blok.text}
                        </p>
                    )}

                    {((blok.button_text && href) || (blok.secondary_button_text && hrefSecondary)) && (
                        <div className="flex flex-row gap-8 mt-8">
                            {blok.button_text && href && (
                                <Button variant="primary" href={href}>
                                    {blok.button_text}
                                </Button>
                            )}

                            {blok.secondary_button_text && hrefSecondary && (
                                <Button variant="secondary" hollow href={hrefSecondary}>
                                    {blok.secondary_button_text}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Section>
        </Section>
    );
};
