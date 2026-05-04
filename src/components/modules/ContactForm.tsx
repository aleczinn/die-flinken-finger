'use client';

import { Locale } from "@/lib/locale/locales";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";
import { t } from "@/lib/i18n";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { css } from "@/lib/utils";
import { IconSendOutline } from "@/components/icons";
import { Input } from "@/components/ui/Input";
import { required, validate, email, personName } from "@/lib/validation";
import { TextArea } from "@/components/ui/TextArea";

interface ContactFormProps {
    locale: Locale
    topics: ContactFormTopic[];
    className?: string;
}

interface ContactFormTopic {
    label: string;
    value: string;
}

interface FormErrors {
    topic?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    message?: string;
}

export default function ContactForm({ locale, topics, className }: ContactFormProps) {
    const defaultTopic = topics.length > 0 && topics[0];
    const defaultValue = defaultTopic ? (defaultTopic.value || defaultTopic.label) : '';

    const [topic, setTopic] = useState(defaultValue ?? '');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    const firstNameRef = useRef<HTMLInputElement>(null);
    const sureNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const [errors, setErrors] = useState<FormErrors>({});

    const labels = {
        first_name: t(locale, 'generic.first_name'),
        last_name: t(locale, 'generic.last_name'),
        required: t(locale, 'contact_form.validation.required'),
        topic: t(locale, 'contact_form.validation.topic'),
        message: t(locale, 'contact_form.validation.message'),
        character: t(locale, 'contact_form.validation.character'),
        email: t(locale, 'contact_form.validation.email'),
    }

    // Pro Feld eine Validate-Funktion. Wird bei Blur und bei Submit aufgerufen.
    const validators = {
        topic: () => validate(topic, required(labels.topic)),
        firstName: () => validate(firstName, required(labels.required), personName(labels.character)),
        lastName: () => validate(lastName, required(labels.required), personName(labels.character)),
        email: () => validate(emailValue, required(labels.required), email(labels.email)),
        message: () => validate(message, required(labels.message)),
    } satisfies Record<keyof FormErrors, () => string | null>;

    const validateField = (field: keyof FormErrors) => {
        const error = validators[field]();
        setErrors((prev) => ({ ...prev, [field]: error ?? undefined }));
    };

    // Wenn der User korrigiert, sofort den Fehler entfernen — sonst bleibt
    // "ungültig" stehen, obwohl der Wert inzwischen korrekt ist
    const clearError = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = () => {
        const newErrors: FormErrors = {};
        (Object.keys(validators) as (keyof FormErrors)[]).forEach((field) => {
            const error = validators[field]();
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            // Fokus aufs erste fehlerhafte Feld setzen
            if (newErrors.firstName) firstNameRef.current?.focus();
            else if (newErrors.lastName) sureNameRef.current?.focus();
            else if (newErrors.email) emailRef.current?.focus();
            else if (newErrors.message) messageRef.current?.focus();
            return;
        }

        // ... Daten absenden
        console.log({ topic, firstName, lastName, email: emailValue, message, files });
    };

    return (
        <div className={css(
            'flex flex-col justify-center bg-white p-8 lg:p-12 rounded-2xl',
            className
        )}>
            <Select label={t(locale, 'contact_form.service.label')}
                    options={topics}
                    value={topic}
                    required
                    error={errors.topic}
                    onChange={(v: string) => {
                        setTopic(v);
                        validateField('topic');
                    }}
                    placeholder={t(locale, 'contact_form.service.placeholder')}
                    className="mb-8"
            />

            <div className="flex flex-row gap-4">
                <Input ref={firstNameRef}
                       label={t(locale, 'generic.first_name')}
                       value={firstName}
                       onChange={(v: string) => { setFirstName(v); clearError('firstName'); }}
                       onBlur={() => validateField('firstName')}
                       error={errors.firstName}
                       required
                       autoComplete="name"
                />

                <Input ref={sureNameRef}
                       label={t(locale, 'generic.last_name')}
                       value={lastName}
                       onChange={(v: string) => { setLastName(v); clearError('lastName'); }}
                       onBlur={() => validateField('lastName')}
                       error={errors.lastName}
                       required
                       autoComplete="name"
                />
            </div>

            <Input ref={emailRef}
                   label={t(locale, 'generic.email.short')}
                   value={emailValue}
                   onChange={(v: string) => { setEmailValue(v); clearError('email'); }}
                   onBlur={() => validateField('email')}
                   error={errors.email}
                   required
                   autoComplete="email"
            />

            <TextArea ref={messageRef}
                      label={t(locale, 'contact_form.request.label')}
                      value={message}
                      onChange={(v: string) => { setMessage(v); clearError('message'); }}
                      onBlur={() => validateField('message')}
                      error={errors.message}
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

            <Button variant="primary"
                    type="button"
                    onClick={handleSubmit}
                    iconLeft={<IconSendOutline className="w-4 h-auto" />}
            >
                {t(locale, 'contact_form.submit')}
            </Button>
        </div>
    );
}