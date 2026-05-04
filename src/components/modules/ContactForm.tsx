'use client';

import { Locale } from "@/lib/locale/locales";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/TextArea";
import { FileUpload } from "@/components/ui/FileUpload";
import { t } from "@/lib/i18n";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { css } from "@/lib/utils";
import { IconSendOutline } from "@/components/icons";
import { Input } from "@/components/ui/Input";

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
    const defaultTopic = topics.length > 0 && topics[0];
    const defaultValue = defaultTopic ? (defaultTopic.value || defaultTopic.label) : '';

    const [topic, setTopic] = useState(defaultValue ?? '');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    const [firstName, setFirstName] = useState('');
    const [sureName, setSureName] = useState('');
    const [email, setEmail] = useState('');
    const firstNameRef = useRef<HTMLInputElement>(null);
    const sureNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    return (
        <div className={css(
            'flex flex-col justify-center bg-white p-8 lg:p-12 rounded-2xl',
            className
        )}>
            <Select label={t(locale, 'contact_form.service.label')}
                    options={topics}
                    value={topic}
                    required
                    onChange={setTopic}
                    placeholder={t(locale, 'contact_form.service.placeholder')}
                    className="mb-8"
            />

            <div className="flex flex-row gap-4">
                <Input ref={firstNameRef}
                       label="Vorname"
                       value={firstName}
                       onChange={setFirstName}
                       required
                       autoComplete="name"
                />

                <Input ref={sureNameRef}
                       label="Nachname"
                       value={sureName}
                       onChange={setSureName}
                       required
                       autoComplete="name"
                />
            </div>

            <Input ref={emailRef}
                   label="E-Mail"
                   value={email}
                   onChange={setEmail}
                   required
                   autoComplete="email"
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

            <span className="text-gray-70 text-sm mb-8">Wir verwenden Ihre Angaben zur Beantwortung Ihrer Anfrage. Weitere Informationen finden Sie in unseren Datenschutzhinweisen.</span>

            <Button variant="primary" type="button" iconLeft={
                <IconSendOutline className="w-4 h-auto" />
            }>
                {t(locale, 'contact_form.submit')}
            </Button>
        </div>
    );
}