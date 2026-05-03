'use client';

import { Locale } from "@/lib/locale/locales";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/TextArea";
import { FileUpload } from "@/components/ui/FileUpload";
import { t } from "@/lib/i18n";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { css } from "@/lib/utils";
import { IconSendOutline } from "@/components/icons";

interface ContactFormProps {
    locale: Locale
    topics: ContactFormTopic[];
    className?: string;
}

interface ContactFormTopic {
    label: string;
    value: string;
}

export default function ContactForm({ locale, topics, className }: ContactFormProps) {
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    return (
        <div className={css(
            'flex flex-col justify-center bg-white p-8 lg:p-12 rounded-2xl',
            className
        )}>
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

            <div className="flex flex-row justify-end">
                <Button variant="primary" type="button">
                    {t(locale, 'contact_form.next')}
                </Button>
            </div>

            {/*<Button variant="primary" type="button" iconLeft={*/}
            {/*    <IconSendOutline className="w-4 h-auto" />*/}
            {/*}>*/}
            {/*    {t(locale, 'contact_form.submit')}*/}
            {/*</Button>*/}
        </div>
    );
}