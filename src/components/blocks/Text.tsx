import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section from '@/components/layout/Section';
import StoryblokRichText from "@/components/storyblok/StoryblokRichText";

interface TextProps {
    blok: SbBlokData & {
        text: any;
    };
}

export default function Text({ blok }: TextProps) {
    return (
        <Section as="div"
                 variant="capped"
                 outerClassName="py-section pt-12"
                 {...storyblokEditable(blok)}
        >
            <StoryblokRichText content={blok.text} />
        </Section>
    );
};
