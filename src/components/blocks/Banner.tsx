import { Locale } from "@/lib/locale/locales";
import { SbBlokData } from "@storyblok/react";
import { storyblokEditable } from "@storyblok/react/rsc";
import Section from "@/components/layout/Section";
import { useId } from "react";
import { resolveStoryblokLink } from "@/lib/locale/links";
import { Headline } from "@/components/ui/Headline";
import StoryblokRichTextRenderer from "@/components/storyblok/StoryblokRichTextRenderer";
import { Button } from "@/components/ui/Button";

interface BannerProps {
    locale: Locale,
    blok: SbBlokData & {
        headline: string;
        text: any;
        primary_button_text?: string;
        primary_button_link?: any;
        secondary_button_text?: string;
        secondary_button_link?: any;
    };
}

export default async function Banner({ locale, blok }: BannerProps) {
    const headingId = useId();
    const href = await resolveStoryblokLink(blok.primary_button_link, locale.language);
    const hrefSecondary = await resolveStoryblokLink(blok.secondary_button_link, locale.language);

    return (
        <Section variant="capped"
                 background={'primary'}
                 outerClassName="py-section"
                 innerClassName="grid grid-cols-1 lg:grid-cols-2 gap-8"
                 aria-labelledby={blok.headline}
                 {...storyblokEditable(blok)}
        >
            <div className="flex flex-col">
                {blok.headline && (
                    <Headline id={headingId} as="h2" variant="h3" alignment='left' design="w-line" className="text-gray-10 mb-4">
                        {blok.headline}
                    </Headline>
                )}

                {blok.text && (
                    <StoryblokRichTextRenderer content={blok.text} className="text-gray-10 leading-relaxed" />
                )}
            </div>

            {((blok.primary_button_text && href) || (blok.secondary_button_text && hrefSecondary)) && (
                <div className="flex flex-row justify-start md:justify-center items-center gap-4">
                    {blok.primary_button_text && href && (
                        <Button variant="secondary" href={href}>
                            {blok.primary_button_text}
                        </Button>
                    )}

                    {blok.secondary_button_text && hrefSecondary && (
                        <Button variant="secondary" hollow href={hrefSecondary}>
                            {blok.secondary_button_text}
                        </Button>
                    )}
                </div>
            )}
        </Section>
    );
}