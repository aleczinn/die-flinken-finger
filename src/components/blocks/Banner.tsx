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
        button_text?: string;
        button_link?: any;
    };
}

export default async function Banner({ locale, blok }: BannerProps) {
    const headingId = useId();
    const href = await resolveStoryblokLink(blok.button_link, locale.language);

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
                    <StoryblokRichTextRenderer content={blok.text} className="text-gray-10" />
                )}
            </div>

            <div className="flex flex-row justify-center items-center gap-4">
                {blok.button_text && href && (
                    <Button variant="secondary" hollow href={href} className="">
                        {blok.button_text}
                    </Button>
                )}
            </div>
        </Section>
    );
}