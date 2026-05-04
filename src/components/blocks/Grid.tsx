import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';
import { Headline } from "@/components/ui/Headline";
import { Locale } from "@/lib/locale/locales";
import { useId } from "react";
import { Tagline } from "@/components/ui/Tagline";
import { IconSunOutline } from "@/components/icons";
import { Text } from "@/components/ui/Text";
import { css } from "@/lib/utils";
import { resolveStoryblokLink } from "@/lib/locale/links";
import { StoryblokLink } from "@/lib/storyblok-queries";

interface GridProps {
    locale: Locale;
    blok: SbBlokData & {
        tagline?: string;
        headline: string;
        text?: string;
        items: CardProps[]
    };
}

interface CardProps {
    title: string;
    description: string;
    link: StoryblokLink;
}

export default async function Grid({ locale, blok }: GridProps) {
    const headingId = useId();

    return (
        <Section variant="capped"
                 outerClassName="py-section"
                 innerClassName="flex flex-col gap-8"
                 aria-labelledby={blok.headline ? headingId : undefined}
                 {...storyblokEditable(blok)}
        >
            <div className="flex flex-col">
                {blok.tagline && (
                    <Tagline alignment="left" children={blok.tagline} className="mb-2" />
                )}

                {blok.headline && (
                    <Headline id={headingId} as="h2" variant="h3" alignment="left" design="line" className="mb-8">
                        {blok.headline}
                    </Headline>
                )}

                {blok.text && (
                    <Text as="p" children={blok.text} className="max-w-prose"></Text>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blok.items.map(async (item: CardProps) => {
                    return (
                        <Card key={item.title} locale={locale} title={item.title} description={item.description} link={item.link} />
                    );
                })}
            </div>
        </Section>
    );
};

async function Card({ locale, title, description, link }: CardProps & { locale: Locale }) {
    const href = await resolveStoryblokLink(link, locale.language);
    if (!href) {
        return null;
    }

    return (
        <a href={href}
           className={css(
               'group flex flex-col bg-white border-1 border-solid border-gray-20 rounded-xl p-6 flex-1',
               'transition-transform duration-200',
               'hover:cursor-pointer hover:border-primary hover:-translate-y-2 hover:shadow-xl shadow-black/5',
               'focus:border-primary focus:-translate-y-2 focus:shadow-xl',
               'focus-element'
           )}
        >
            <div className="w-16 h-16 bg-primary-lightest transition-colors duration-200 group-hover:bg-primary mb-8 rounded-xl p-4">
                <IconSunOutline className="text-primary transition-colors duration-200  group-hover:text-white w-full h-full" />
            </div>

            <div className="font-semibold text-xl leading-none tracking-tight mb-4">
                {title}
            </div>

            <span className="text-gray-70 text-sm mb-8">
                {description}
            </span>

            <span className="text-primary text-sm">Mehr erfahren</span>
        </a>
    )
}