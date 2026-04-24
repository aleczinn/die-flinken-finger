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
        asset?: any;
        button_style: 'filled' | 'hollow';
        button_text?: string;
        button_link?: any;
    };
}

export default async function Banner({ locale, blok }: BannerProps) {
    const headingId = useId();
    const hasAsset = blok.asset.id !== null;
    const sectionClassName = hasAsset ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : 'flex flex-col'
    const href = await resolveStoryblokLink(blok.button_link, locale.language);

    return (
        <Section variant="capped"
                 background={'primary'}
                 outerClassName="py-section"
                 innerClassName={sectionClassName}
                 aria-labelledby={blok.headline}
                 {...storyblokEditable(blok)}
        >
            <div className="flex flex-col justify-center gap-8">
                {blok.headline && (
                    <Headline id={headingId} as="h2" variant="h3" design="line-left-white" className="text-gray-10">
                        {blok.headline}
                    </Headline>
                )}

                {blok.text && (
                    <StoryblokRichTextRenderer content={blok.text} className="text-gray-10" />
                )}

                {blok.button_text && href && (
                    <Button variant="secondary" hollow={blok.button_style === 'hollow'} href={href} className="">
                        {blok.button_text}
                    </Button>
                )}
            </div>
        </Section>
    );
}