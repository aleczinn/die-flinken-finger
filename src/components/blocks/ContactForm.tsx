import { Locale } from "@/lib/locale/locales";
import { SbBlokData } from "@storyblok/react";
import { storyblokEditable } from "@storyblok/react/rsc";
import Section from "@/components/layout/Section";
import { useId } from "react";
import { resolveStoryblokLink } from "@/lib/locale/links";
import { Headline } from "@/components/ui/Headline";
import StoryblokRichTextRenderer from "@/components/storyblok/StoryblokRichTextRenderer";

interface ContactFormProps {
    locale: Locale,
    blok: SbBlokData & {
        headline: string;
        text?: any;
        dropdown_items: ContactFormDropdownItem[];
    };
}

interface ContactFormDropdownItem {
    label: string;
}

export default async function ContactForm({ locale, blok }: ContactFormProps) {
    const headingId = useId();

    return (
        <Section variant="capped"
                 outerClassName="py-section"
                 innerClassName="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
                 aria-labelledby={blok.headline}
                 {...storyblokEditable(blok)}
        >
            {/* Headline + Text */}
            <div className="flex flex-col justify-center gap-8">
                {blok.headline && (
                    <Headline id={headingId} as="h2" variant="h3" design="line-left">
                        {blok.headline}
                    </Headline>
                )}

                {blok.text && (
                    <StoryblokRichTextRenderer content={blok.text} className="text-gray-90" />
                )}
            </div>

            {/* Contact Form */}
            <div className="flex flex-col justify-center bg-white p-12">
                <span>Service*</span>
                <div>inputfeld</div>

                <span>Beschreiben Sie uns kurz Ihr Anliegen *</span>
                <div>textarea</div>

                <span>Gerne können Sie uns ergänzende Dokumente oder Bilder zusenden – so können wir Ihre Anfrage schneller und gezielter bearbeiten.</span>
                <div>field</div>
            </div>
        </Section>
    );
}