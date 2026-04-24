import { Locale } from "@/lib/locale/locales";
import { SbBlokData } from "@storyblok/react";
import { storyblokEditable } from "@storyblok/react/rsc";
import Section from "@/components/layout/Section";
import { useId } from "react";
import { resolveStoryblokLink } from "@/lib/locale/links";
import { Headline } from "@/components/ui/Headline";
import StoryblokRichTextRenderer from "@/components/storyblok/StoryblokRichTextRenderer";

interface BannerProps {
    locale: Locale,
    blok: SbBlokData & {
        headline: string;
        text: any;
        asset?: any;
        primary_button_text?: string;
        primary_button_link?: any;
        secondary_button_text?: string;
        secondary_button_link?: any;
    };
}

export default async function Banner({ locale, blok }: BannerProps) {
    const headingId = useId();
    const hasAsset = blok.asset.id !== null;
    const sectionClassName = hasAsset ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'flex flex-col'
    const primaryHref = await resolveStoryblokLink(blok.primary_button_link, locale.language);
    const secondaryHref = await resolveStoryblokLink(blok.secondary_button_link, locale.language);

    return (
        <Section variant="capped"
                 background={'primary'}
                 outerClassName="py-section"
                 innerClassName={sectionClassName}
                 aria-labelledby={blok.headline}
                 {...storyblokEditable(blok)}
        >
            <div className="flex flex-col justify-center">
                {blok.headline && (
                    <Headline id={headingId} as="h2" variant="h3" design="line-left-white" className="text-gray-10 mb-8">
                        {blok.headline}
                    </Headline>
                )}

                {blok.text && (
                    <StoryblokRichTextRenderer content={blok.text} className="text-gray-10" />
                )}
            </div>
        </Section>
    );
}