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
import { Tagline } from "@/components/ui/Tagline";
import Link from "next/link";
import { IconChevronRight, IconMail, IconWaterDrop } from "@/components/icons";
import { Text } from "@/components/ui/Text";
import { MyLink } from "@/components/ui/MyLink";

interface HeroProps {
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
    link: any;
}

export default async function Grid({ locale, blok }: HeroProps) {
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
                {blok.items.map((item: CardProps) => {
                    return (
                        <Card key={item.title} title={item.title} description={item.description} link={item.link} />
                    );
                })}
            </div>
        </Section>
    );
};

function Card({ title, description, link }: CardProps) {
    return (
        <div className="group flex flex-col bg-white border-1 border-solid border-gray-20 rounded-xl p-6 flex-1 hover:cursor-pointer transition-transform duration-200 hover:border-primary hover:-translate-y-2 hover:shadow-xl shadow-black/5">
            <div className="w-16 h-16 bg-primary-lightest transition-colors duration-200 group-hover:bg-primary mb-8 rounded-xl p-4">
                <IconMail className="text-primary transition-colors duration-200  group-hover:text-white w-full h-full" />
            </div>

            <div className="font-semibold text-xl leading-none tracking-tight mb-4">
                {title}
            </div>

            <span className="text-gray-80 text-sm mb-8">
                {description}
            </span>

            <MyLink href="/" design="secondary">
                Mehr erfahren
            </MyLink>
        </div>
    )
}