'use client';

import { Locale } from "@/lib/locale/locales";
import { SbBlokData } from "@storyblok/react";
import { storyblokEditable } from "@storyblok/react/rsc";
import Section, { SectionBackground } from "@/components/layout/Section";
import { useId, useState } from "react";
import { Headline } from "@/components/ui/Headline";
import StoryblokRichTextRenderer from "@/components/storyblok/StoryblokRichTextRenderer";
import { Select } from "@/components/ui/Select";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

interface ContactFormProps {
    locale: Locale,
    blok: SbBlokData & {
        headline: string;
        text?: any;
        dropdown_items: ContactFormDropdownItem[];
    };
    background?: SectionBackground;
}

interface ContactFormDropdownItem {
    label: string;
    emailKey?: string;
}

export default function ContactForm({ locale, blok, background }: ContactFormProps) {
    const headingId = useId();

    const itemsTopics = [];
    const [topic, setTopic] = useState('');

    return (
        <Section variant="capped"
                 background={background}
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
            <div className="flex flex-col justify-center bg-transparent md:bg-white p-0 md:p-12">
                <Select label={t(locale, 'contact_form.service.label')}
                        options={[
                            { value: 'general', label: 'Allgemeine Anfrage' },
                            { value: 'heizung', label: 'Heizung' },
                        ]}
                        required
                        value={topic}
                        onChange={setTopic}
                        placeholder={t(locale, 'contact_form.service.placeholder')}
                        className="mb-4"
                />

                <span>{`${t(locale, 'contact_form.request.label')}*`}</span>
                <div>textarea</div>

                <span>{t(locale, 'contact_form.documents.description')}</span>
                <span>{`${t(locale, 'contact_form.documents.label')}*`}</span>
                <span>{t(locale, 'contact_form.documents.field_description')}</span>

                <Button variant="primary" type="button">
                    {t(locale, 'contact_form.submit')}
                </Button>
            </div>
        </Section>
    );
}