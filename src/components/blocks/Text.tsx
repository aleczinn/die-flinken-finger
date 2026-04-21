import { storyblokEditable } from '@storyblok/react/rsc';
import { SbBlokData } from '@storyblok/react';
import Section, { SectionBackground } from '@/components/layout/Section';
import StoryblokRichText from "@/components/storyblok/StoryblokRichText";

interface TextProps {
    blok: SbBlokData & {
        text: any;
    };
    background?: SectionBackground;
}

export default function Text({ blok, background }: TextProps) {
    return (
        <Section as="div"
                 variant="capped"
                 background={background}
                 outerClassName="py-section"
                 {...storyblokEditable(blok)}
        >
            <StoryblokRichText content={blok.text} />
        </Section>
    );
};
