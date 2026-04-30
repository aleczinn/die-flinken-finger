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
import { Textarea } from "@/components/ui/TextArea";
import { FileUpload } from "@/components/ui/FileUpload";

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
    value?: string;
}

export default function ContactForm({ locale, blok, background }: ContactFormProps) {
    const headingId = useId();

    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    const topics = blok.dropdown_items.map((item) => ({
        label: item.label,
        value: item.value || item.label,
    }));

    return (
        <Section variant="capped"
                 background={background}
                 outerClassName="py-section"
                 innerClassName="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
                 aria-labelledby={blok.headline ? headingId : undefined}
                 {...storyblokEditable(blok)}
        >
            {/* Headline + Text */}
            <div className="flex flex-col justify-center gap-8">
                {blok.headline && (
                    <Headline id={headingId} as="h2" variant="h3" alignment="left" design="line">
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
                        options={topics}
                        required
                        value={topic}
                        onChange={setTopic}
                        placeholder={t(locale, 'contact_form.service.placeholder')}
                        className="mb-8"
                />

                <Textarea label={t(locale, 'contact_form.request.label')}
                          value={message}
                          onChange={setMessage}
                          name="message"
                          maxLength={2000}
                          rows={6}
                          required
                          className="mb-8"
                />

                <span className="mb-2">{t(locale, 'contact_form.documents.description')}</span>

                <FileUpload label={t(locale, 'contact_form.documents.label')}
                            description={t(locale, 'contact_form.documents.field_description')}
                            files={files}
                            onChange={setFiles}
                            accept={['image/*', '.pdf']}
                            maxSize={10 * 1024 * 1024}
                            multiple
                            name="files"
                            className="mb-8"
                />

                <Button variant="primary" type="button">
                    {t(locale, 'contact_form.submit')}
                </Button>
            </div>
        </Section>
    );
}