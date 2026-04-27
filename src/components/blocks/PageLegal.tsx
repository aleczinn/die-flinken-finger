import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import { ReactNode, useId } from "react";
import Section from "@/components/layout/Section";
import { Headline } from "@/components/ui/Headline";
import StoryblokRichTextRenderer from "@/components/storyblok/StoryblokRichTextRenderer";

interface PageLegalProps {
    blok: SbBlokData & {
        title: string;
        slug?: string;
        text: any;
    };
    breadcrumbs?: ReactNode;
}

export default function PageLegal({ blok, breadcrumbs }: PageLegalProps) {
    const headingId = useId();

    return (
        <div className="flex-1 flex flex-col" {...storyblokEditable(blok)}>
            {breadcrumbs && breadcrumbs}

            <Section as="div" variant="capped" outerClassName="">
                <Headline id={headingId} as="h1" variant="h2" alignment="left" design="line" className="mt-4">
                    {blok.title}
                </Headline>
            </Section>

            <Section as="div" variant="capped" outerClassName="pt-9 pb-24" aria-labelledby={headingId}>
                <StoryblokRichTextRenderer content={blok.text} className="max-w-prose" />
            </Section>
        </div>
    )
};

